import { Module } from "@nestjs/common";
import { AuthController } from "./api/auth.controller";
import { AuthService } from "./application/auth.service";
import { UsersModule } from "../users/users.module";
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../users/domain/user.entity';
import { TokensModule } from '../tokens/tokens.module';
import { DevicesModule } from '../devices/devices.module';

@Module({
  imports: [
    DevicesModule,
    TokensModule,
    UsersModule,
    TypeOrmModule.forFeature([UserEntity]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
  ],
})
export class AuthModule {}
