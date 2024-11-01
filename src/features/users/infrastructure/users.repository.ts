import { BadRequestException, forwardRef, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { DataSource, In, Repository } from 'typeorm';
import { UserEntity } from '../domain/user.entity';
import { CreateUserDto } from '../api/models/input/create-user.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';


@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(UserEntity) private readonly uRepository: Repository<UserEntity>,
  ) {
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    return await this.uRepository.save(createUserDto);
  }

  async getAllUsers() {
    return await this.uRepository.find();
  }

  async updateUserByResendEmail(currentData: any, newData: any) {
    return await this.uRepository.save({
      ...currentData,
      ...newData,
    });
  }

  async findUserById(id: string) {
    const findedUser = await this.uRepository.findOneBy({ id });
    if (!findedUser) {
      throw new NotFoundException('User not found');
    }
    return findedUser;
  }

  async findUserByLogin(login: string) {
    const findedUser = await this.uRepository.findOneBy({ login });
    if (!findedUser) {
      throw new UnauthorizedException('User not found');
    }
    return findedUser;
  }

  async findUserByEmail(email: string) {
    const findedUser = await this.uRepository.findOneBy({ email });
    if (!findedUser) {
      throw new NotFoundException('User not found');
    }
    return findedUser;
  }

  async findUserByCode(code: string) {
    const findedUser = await this.uRepository.findOne({
      where: {
        emailConfirmation: { confirmationCode: code },
      },
    });
    if (!findedUser) {
      throw new NotFoundException('User not found');
    }
    return findedUser;
  }

  async deleteUserById(id: string) {
    const findedUser = await this.findUserById(id);
    return await this.uRepository.delete(id);
  }

  async checkUserExistsByLogin(login: string, email: string) {
    const findedUser = await this.uRepository.findOne({
      where: [
        { login },
        {email}
      ],
    });
    if (findedUser) {
      throw new BadRequestException('User already exists');
    }
  }

}
