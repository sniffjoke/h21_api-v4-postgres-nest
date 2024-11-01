import {Module} from '@nestjs/common';
import {TestingController} from "./api/testing.controller";
import {TestingService} from "./application/testing.service";
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../users/domain/user.entity';

@Module({
    imports: [
      TypeOrmModule.forFeature([UserEntity])
    ],
    controllers: [TestingController],
    providers: [
        TestingService,
    ],
})
export class TestingModule {
}
