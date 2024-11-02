// import { CreateUserDto, EmailConfirmationModel } from '../api/models/input/create-user.dto';
// import { SETTINGS } from '../../../core/settings/settings';
// import { InjectRepository } from '@nestjs/typeorm';
// import { UserEntity } from '../domain/user.entity';
// import { UsersRepository } from '../infrastructure/users.repository';
// import { UsersService } from './users.service';
//
// class UseCase {
//   constructor(
//     private readonly usersRepository: UsersRepository,
//     private readonly usersService: UsersService,
//     private
//   ) {
//
//   }
//
//   async execute(createUserDto: CreateUserDto, isConfirm: false) {
//     const isUserExists = await this.usersRepository.checkIsUserExists(createUserDto.login, createUserDto.email)
//     const emailConfirmation: EmailConfirmationModel = this.usersService.createEmailConfirmation(isConfirm);
//     if (!isConfirm) {
//       await this.usersService.sendActivationEmail(createUserDto.email, `${SETTINGS.PATH.API_URL}/?code=${emailConfirmation.confirmationCode as string}`);
//     }
//     const hashPassword = await this.cryptoService.hashPassword(createUserDto.password);
//     const newUserData = { ...createUserDto, emailConfirmation: {...emailConfirmation}, password: hashPassword };
//     console.log(emailConfirmation);
//     const saveData = await this.usersRepository.createUser(newUserData);
//     return saveData.id;
//   }
// }
