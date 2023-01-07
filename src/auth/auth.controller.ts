import {
  Body,
  Controller,
  Post,
  BadRequestException,
  UseGuards,
  Req,
  HttpCode,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { USER_EXIST_ERROR } from './auth.constants';
import { AuthService } from './auth.service';
import { LocalGuard } from './guards/local.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('signup')
  async signup(@Body() dto: CreateUserDto): Promise<UserEntity> {
    const oldUser = await this.usersService.findUserByEmail(dto.email);
    if (oldUser) throw new BadRequestException(USER_EXIST_ERROR);

    return await this.usersService.create(dto);
  }

  @UseGuards(LocalGuard)
  @HttpCode(200)
  @Post('signin')
  async signin(@Req() { user }): Promise<{
    access_token: string;
  }> {
    return await this.authService.login(user.email);
  }
}
