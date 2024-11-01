import { Module } from "@nestjs/common";
import { TokensService } from "./application/tokens.service";
import { JwtModule} from "@nestjs/jwt";
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenEntity } from './domain/token.entity';
import { TokensRepository } from './infrastructure/tokens.repository';

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
