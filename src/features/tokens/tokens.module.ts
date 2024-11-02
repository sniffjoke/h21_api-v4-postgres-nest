import { Module } from "@nestjs/common";
import { TokensService } from "./application/tokens.service";
import { JwtModule} from "@nestjs/jwt";
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokensRepository } from './infrastructure/tokens.repository';
import { TokenEntity } from './domain/token.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TokenEntity]),
    JwtModule.register({global: true})
  ],
  controllers: [],
  providers: [
    TokensService,
    TokensRepository,
  ],
  exports: [
    TokensService,
    JwtModule,
    TokensRepository,
  ]
})
export class TokensModule {}
