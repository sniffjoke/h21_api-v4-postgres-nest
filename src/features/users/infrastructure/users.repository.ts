import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailConfirmationModel } from '../api/models/input/create-user.dto';
import { UserEntity } from '../domain/user.entity';


@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(UserEntity) private readonly uRepository: Repository<UserEntity>,
  ) {
  }

  async createUser(userData: any) {
    const result = await this.uRepository.save(userData);
    return result;
  }


  async updateUserByActivateEmail(userId: any) {
    const updateUserInfo = await this.uRepository.update(
      { id: userId },
      {
        emailConfirmation: {
          isConfirm: true,
        },
      });
    //
    // UPDATE users
    // SET "emailConfirmationIsConfirm" = true
    // WHERE id = $1
    // `,
    // [userId]);
    return updateUserInfo;
  }

  async updateUserByResendEmail(userId: any, emailConfirmation: EmailConfirmationModel) {
    const updateUserInfo = await this.uRepository.update(
      { id: userId },
      {
        emailConfirmation: {
          confirmationCode: emailConfirmation.confirmationCode,
          expirationDate: emailConfirmation.expirationDate,
        },
      },
    );
    // UPDATE users
    // SET "emailConfirmationExpirationDate" = $2, "emailConfirmationConfirmationCode" = $3
    // WHERE id = $1
    // [
    //   userId,
    //   emailConfirmation.emailConfirmationExpirationDate,
    //   emailConfirmation.emailConfirmationConfirmationCode,
    // ]);
    return updateUserInfo;
  }

  async findUserById(id: string) {
    const findedUser = await this.uRepository.findOne(
      { where: { id } },
      // 'SELECT * FROM users WHERE id = $1', [id]
    );
    if (!findedUser) {
      throw new NotFoundException('User not found');
    }
    return findedUser;
  }

  async findUserByIdOrNull(id: string) {
    const findedUser = await this.uRepository.findOne(
      { where: { id } },
      // 'SELECT * FROM users WHERE id = $1', [id]
    );
    if (!findedUser) {
      return null;
    } else return findedUser;
  }

  async findUserByLogin(login: string) {
    const findedUser = await this.uRepository.findOne(
      { where: { login } },
      // 'SELECT * FROM users WHERE login = $1', [login]
    );
    if (!findedUser) {
      throw new UnauthorizedException('User not found');
    }
    return findedUser;
  }

  async findUserByEmail(email: string) {
    const findedUser = await this.uRepository.findOne(
      { where: { email } },
      // SELECT * FROM users WHERE email = $1,
      // [email],
    );
    if (!findedUser) {
      throw new BadRequestException('Email not exists');
    }
    return findedUser;
  }

  async findUserByCode(code: string) {
    const findedUser = await this.uRepository.findOne(
      {
        where: {
          emailConfirmation: { confirmationCode: code },
        },
      },
      // 'SELECT * FROM users WHERE "emailConfirmationConfirmationCode" = $1', [code]
    );
    if (!findedUser) {
      throw new BadRequestException('Code not found');
    }
    return findedUser;
  }

  async deleteUserById(id: string) {
    const findedUser = await this.findUserById(id);
    return await this.uRepository.delete(
      { id },
      // 'DELETE FROM users WHERE "id" = $1', [id]
    );
  }

  async checkIsUserExists(login: string, email: string) {
    const findedUserByLogin = await this.uRepository.findOne(
      { where: { login } },
      // 'SELECT * FROM users WHERE "login" = $1',
      // [login],
    );
    if (findedUserByLogin) {
      throw new BadRequestException(
        'Login already exists',
      );
    }
    const findedUserByEmail = await this.uRepository.findOne(
      { where: { email } },
      // 'SELECT * FROM users WHERE "email" = $1',
      // [email],
    );
    if (findedUserByEmail) {
      throw new BadRequestException('Email already exists');
    }
  }

}
