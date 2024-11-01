import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto, EmailConfirmationModel } from '../api/models/input/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../domain/user.entity';
import { Repository } from 'typeorm';
import { SETTINGS } from '../../../core/settings/settings';
import { UsersRepository } from '../infrastructure/users.repository';
import { MailerService } from '@nestjs-modules/mailer';
import { UuidService } from 'nestjs-uuid';
import { add } from 'date-fns';
import { CryptoService } from '../../../core/modules/crypto/application/crypto.service';

@Injectable()
export class UsersService {

  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly mailService: MailerService,
    private readonly uuidService: UuidService,
    private readonly cryptoService: CryptoService,
  ) {
  }

  async createUser(createUserDto: CreateUserDto, isConfirm: boolean): Promise<string> {
    const isUserExists = await this.usersRepository.checkUserExistsByLogin(createUserDto.login, createUserDto.email)
    const emailConfirmation: EmailConfirmationModel = this.createEmailConfirmation(isConfirm);
    if (!isConfirm) {
      await this.sendActivationEmail(createUserDto.email, `${SETTINGS.PATH.API_URL}/?code=${emailConfirmation.confirmationCode as string}`);
    }
    const hashPassword = await this.cryptoService.hashPassword(createUserDto.password);
    const newUserData = { ...createUserDto, password: hashPassword, emailConfirmation };
    const saveData = await this.usersRepository.createUser(newUserData);
    return saveData.id;
  }

  private createEmailConfirmation(isConfirm: boolean) {
    const emailConfirmationNotConfirm: EmailConfirmationModel = {
      isConfirmed: false,
      confirmationCode: this.uuidService.generate(),
      expirationDate: add(new Date(), {
          hours: 1,
          minutes: 30,
        },
      ).toString(),
    };
    const emailConfirmationIsConfirm: EmailConfirmationModel = {
      isConfirmed: true,
    };
    return isConfirm ? emailConfirmationIsConfirm : emailConfirmationNotConfirm;
  }

  private async sendActivationEmail(to: string, link: string) {
    await this.mailService.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: 'Активация аккаунта на ' + SETTINGS.PATH.API_URL,
      text: '',
      html:
        `
                <h1>Thank for your registration</h1>
                <p>To finish registration please follow the link below:
                    <a href='${link}'>Завершить регистрацию</a>
                </p>

            `,
    });
  }

  async resendEmail(email: string) {
    const isUserExists = await this.usersRepository.findUserByEmail(email);
    if (isUserExists.emailConfirmation.isConfirmed) {
      throw new BadRequestException('User already activate')
    }
    const emailConfirmation: EmailConfirmationModel = this.createEmailConfirmation(false);
    await this.sendActivationEmail(email, `${SETTINGS.PATH.API_URL}/?code=${emailConfirmation.confirmationCode as string}`);
    const updateUserInfo = await this.usersRepository.updateUserByResendEmail(
      isUserExists,
      {
        emailConfirmation,
      },
    );
    return updateUserInfo;
  }

  async activateEmail(code: string) {
    const isUserExists = await this.usersRepository.findUserByCode(code);
    if (isUserExists.emailConfirmation.isConfirmed) {
      throw new BadRequestException('User already activate')
    }
    const emailConfirmation: EmailConfirmationModel = this.createEmailConfirmation(false);
    const updateUserInfo = await this.usersRepository.updateUserByResendEmail(
      isUserExists,
      {
        emailConfirmation,
      },
    );
    return updateUserInfo;
  }

  async deleteUser(id: string) {
    const deleteUser = await this.usersRepository.deleteUserById(id);
    return deleteUser;
  }

  // async findAll() {
  //   return await this.usersRepository.getAllUsers();
  // }

  // async findOne(id: string) {
  //   return await this.userRepository.findOneBy({ id });
  // }

}
