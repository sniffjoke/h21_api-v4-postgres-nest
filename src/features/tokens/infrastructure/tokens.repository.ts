import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { TokenEntity } from '../domain/token.entity';


@Injectable()
export class TokensRepository {
  constructor(
    @InjectRepository(TokenEntity) private readonly tRepository: Repository<TokenEntity>,
  ) {
  }

  async findToken(filter: any) {
    const findedToken = await this.tRepository.findOne(
      {where: {deviceId: filter.deviceId}}
      // 'SELECT * FROM tokens WHERE "deviceId" = $1',
      // [filter.deviceId],
    );
    if (!findedToken) {
      throw new NotFoundException('Invalid deviceId');
    }
    return findedToken;
  }

  async findTokenByRToken(filter: any) {
    const findedToken = await this.tRepository.findOne(
      {where: {refreshToken: filter.refreshToken}}
      // 'SELECT * FROM tokens WHERE "refreshToken" = $1',
      // [filter.refreshToken],
    );
    if (!findedToken) {
      throw new NotFoundException('Invalid refreshToken');
    }
    return findedToken;
  }

  // Update status tokens for devices

  async updateStatusTokensInDb(filter: any) {
    return await this.tRepository.update(
      {deviceId: filter.deviceId},
      {blackList: true}
      // 'UPDATE tokens SET "blackList" = true WHERE "deviceId" = $1', [filter.deviceId]
    );
  }

  async updateStatusTokensAfterDeleteAllInDb(filter: any) {
    return await this.tRepository.update(
      {deviceId: Not(filter.deviceId), userId: filter.userId},
      {blackList: true}
      // 'UPDATE tokens SET "blackList" = true WHERE "deviceId" <> $1 AND "userId" = $2', [filter.deviceId, filter.userId]
    );
  }

  // Update status tokens after refresh tokens

  async updateStatusRTokensInDb(filter: any) {
    return await this.tRepository.update(
      {refreshToken: filter.refreshToken},
      {blackList: true}
    )
      // `//    UPDATE tokens  SET "blackList" = true WHERE "refreshToken" = $1`,
      // [filter.refreshToken]);
  }

  async createToken(tokenData: any) {
    const result = await this.tRepository.save(
      tokenData
      // 'INSERT INTO tokens ("userId", "deviceId", "refreshToken", "blackList") VALUES ($1, $2, $3, $4) RETURNING *', [
      // tokenData.userId,
      // tokenData.deviceId,
      // tokenData.refreshToken,
      // tokenData.blackList,
    // ]
    );
    return result;
  }

}
