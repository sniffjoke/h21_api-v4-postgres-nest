import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  Query,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { UsersService } from '../application/users.service';
import { CreateUserDto } from './models/input/create-user.dto';
import { BasicAuthGuard } from '../../../core/guards/basic-auth.guard';
import { UsersQueryRepository } from '../infrastructure/users.query-repositories';

@Controller('sa')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly usersQueryRepository: UsersQueryRepository
  ) {
  }

  @Post('users')
  @UseGuards(BasicAuthGuard)
  async create(@Body() createUserDto: CreateUserDto) {
    const userId = await this.usersService.createUser(createUserDto, true);
    const user = await this.usersQueryRepository.userOutput(userId)
    return user
  }

  @Get('users')
  @UseGuards(BasicAuthGuard)
  async findAll(@Query() query: any) {
    // const users = await this.usersService.findAll();
    const users = await this.usersQueryRepository.getAllUsersWithQuery(query)
    // return users.items.map(user => this.usersQueryRepository.userMap(user))
    return users
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.usersService.(+id);
  // }


  @Delete('users/:id')
  @HttpCode(204)
  @UseGuards(BasicAuthGuard)
  remove(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}
