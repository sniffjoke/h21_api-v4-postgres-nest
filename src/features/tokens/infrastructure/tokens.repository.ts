import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TokenEntity } from '../domain/token.entity';


@Injectable()
export class TokensRepository {
  constructor(
    @InjectRepository(TokenEntity) private readonly tRepository: Repository<TokenEntity>,
  ) {
  }

  async findToken(filter: any) {
    const findedToken = await this.tRepository.findOneBy(filter)
    return findedToken
  }

  async updateManyTokensInDb(filter: any, payload: any) {
    const updateTokens = await this.tRepository.update(filter, payload)
    return updateTokens
  }

  async updateOneTokenInDb(filter: any, payload: any) {
    const updateTokens = await this.tRepository.update(filter, payload)
    return updateTokens
  }

  async createToken(tokenData: any) {
    console.log(tokenData);
    const saveToken = await this.tRepository.save(tokenData)
    return saveToken
  }

}
