import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { USER_EXIST_ERROR } from 'src/auth/auth.constants';
import { HashService } from 'src/hash/hash.service';
import { WishEntity } from 'src/wishes/entities/wish.entity';
import { WishlistEntity } from 'src/wishlists/entities/wishlist.entity';
import { DeleteResult, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { SignupUserResponseDto } from './dto/signup-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    private readonly hashService: HashService,
  ) {}

  async create(dto: CreateUserDto): Promise<SignupUserResponseDto> {
    const newUser = this.usersRepository.create({
      ...dto,
      password: await this.hashService.hash(dto.password),
    });
    await this.usersRepository.save(newUser);

    return SignupUserResponseDto.getSignupUserResponse(newUser);
  }

  async findAll(): Promise<UserEntity[]> {
    return this.usersRepository.find();
  }

  async findUser(query: string): Promise<UserEntity> {
    return this.usersRepository.findOne({
      where: [{ username: query }, { email: query }],
    });
  }

  async findMany(query: string): Promise<UserEntity[]> {
    return this.usersRepository.find({
      where: [{ username: query }, { email: query }],
    });
  }

  async findUserById(id: number): Promise<UserEntity> {
    return this.usersRepository.findOneBy({ id });
  }

  async findUserByEmail(email: string): Promise<UserEntity> {
    return this.usersRepository.findOneBy({ email });
  }

  async findUserByUsername(username: string): Promise<UserEntity> {
    return this.usersRepository.findOneBy({ username });
  }

  async updateById(id: number, dto: UpdateUserDto): Promise<UserEntity> {
    const user = await this.findUserById(id);

    if (dto.email && dto.email !== user.email) {
      const foundedUserByEmail = await this.findUserByEmail(dto.email);
      if (foundedUserByEmail) {
        throw new BadRequestException(USER_EXIST_ERROR);
      }
    }

    if (dto.username && dto.username !== user.username) {
      const foundedUserByUsername = await this.findUserByUsername(dto.username);
      if (foundedUserByUsername) {
        throw new BadRequestException(USER_EXIST_ERROR);
      }
    }

    if (dto.password) dto.password = await this.hashService.hash(dto.password);

    await this.usersRepository.update(id, dto);

    return await this.findUserById(id);
  }

  async deleteById(id: number): Promise<DeleteResult> {
    return this.usersRepository.delete(id);
  }

  async getUserWishes(id: number): Promise<WishEntity[]> {
    const { wishes } = await this.usersRepository.findOne({
      where: { id },
      select: ['wishes'],
      relations: ['wishes', 'wishes.owner', 'wishes.offers'],
    });

    for (const wish of wishes) {
      delete wish.owner.password;
      delete wish.owner.email;
    }

    return wishes;
  }

  async getUserWishlists(id: number): Promise<WishlistEntity[]> {
    const { wishlists } = await this.usersRepository.findOne({
      where: { id },
      select: ['wishlists'],
      relations: ['wishlists'],
    });

    return wishlists;
  }
}
