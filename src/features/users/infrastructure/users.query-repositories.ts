import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../domain/user.entity';
import { Like, Repository } from 'typeorm';
import { PaginationBaseModel } from '../../../core/base/pagination.base.model';
import { take } from 'rxjs';


@Injectable()
export class UsersQueryRepository {
  constructor(
    @InjectRepository(UserEntity) private readonly uRepository: Repository<UserEntity>,
  ) {
  }

  async userOutput(id: string) {
    const findedUser = await this.uRepository.findOne({ where: { id } });
    if (!findedUser) {
      throw new NotFoundException('User not found');
    }
    return this.userMap(findedUser as unknown as UserEntity);
  }

  userMap(user: UserEntity) {
    const { email, login, createdAt, id } = user;
    return {
      id: String(id),
      login,
      email,
      createdAt,
    };
  }

  async getAllUsersWithQuery(query: any): Promise<PaginationBaseModel<UserEntity>> {
    const generateQuery = await this.generateQuery(query);
    const items = await this.uRepository
      .find({
        ...generateQuery.userParamsFilter,
        order: {
          [generateQuery.sortBy]: generateQuery.sortDirection,
        },
        take: generateQuery.pageSize,
        skip: (generateQuery.page - 1) * generateQuery.pageSize,
      });

    const itemsOutput = items.map((item: UserEntity) => this.userMap(item));
    const resultPosts = new PaginationBaseModel<UserEntity>(generateQuery, itemsOutput);
    return resultPosts;
  }

  private async generateQuery(query: any) {
    const searchLoginTerm = query.searchLoginTerm ? query.searchLoginTerm : '';
    const searchEmailTerm = query.searchEmailTerm ? query.searchEmailTerm : '';
    const userParamsFilter = {
      where: [
        { email: Like(`%${searchEmailTerm}%`) },
        { login: Like(`%${searchLoginTerm}%`) },
      ],
    };
    const totalCount = await this.uRepository.count(userParamsFilter);
    const pageSize = query.pageSize ? +query.pageSize : 10;
    const pagesCount = Math.ceil(totalCount / pageSize);
    return {
      totalCount,
      pageSize,
      pagesCount,
      page: query.pageNumber ? Number(query.pageNumber) : 1,
      sortBy: query.sortBy ? query.sortBy : 'createdAt',
      sortDirection: query.sortDirection ? query.sortDirection : 'desc',
      userParamsFilter,
      // filterLogin,
      // filterEmail,
    };
  }


}
