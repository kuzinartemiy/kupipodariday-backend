import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { WishEntity } from 'src/wishes/entities/wish.entity';
import { WishlistEntity } from 'src/wishlists/entities/wishlist.entity';
import { UpdateResult } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { USER_NOT_FOUND_ERROR } from './users.constants';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<UserEntity[]> {
    const fondedUsers = (await this.usersService.findAll()).map((user) => {
      delete user.password;
      return user;
    });
    return fondedUsers;
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getLoggedInUser(
    @Req() { user }: { user: UserEntity },
  ): Promise<UserEntity> {
    const foundedUser = await this.usersService.findUserById(user.id);
    if (!foundedUser) throw new NotFoundException(USER_NOT_FOUND_ERROR);
    delete foundedUser.password;
    return foundedUser;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async updateLoggedInUser(
    @Req() { user }: { user: UserEntity },
    @Body() dto: UpdateUserDto,
  ): Promise<UpdateResult> {
    return await this.usersService.updateById(user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me/wishes')
  async getLoggedInUserWishes(
    @Req() { user }: { user: UserEntity },
  ): Promise<WishEntity[]> {
    return await this.usersService.getUserWishes(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me/wishlists')
  async getLoggedInUserWishlists(
    @Req() { user }: { user: UserEntity },
  ): Promise<WishlistEntity[]> {
    return await this.usersService.getUserWishlists(user.id);
  }

  @Get(':username')
  async getUserByUsername(
    @Param('username') username: string,
  ): Promise<UserEntity> {
    const user = await this.usersService.findUserByUsername(username);
    if (!user) throw new NotFoundException(USER_NOT_FOUND_ERROR);
    delete user.password;
    return user;
  }

  @Get('find/:searchQuery')
  async findUser(
    @Param('searchQuery') searchQuery: string,
  ): Promise<UserEntity> {
    const user = await this.usersService.findUser(searchQuery);
    if (!user) throw new NotFoundException(USER_NOT_FOUND_ERROR);
    delete user.password;
    return user;
  }
}
