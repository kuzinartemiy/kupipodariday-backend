import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HashService } from 'src/hash/hash.service';
import { WishEntity } from 'src/wishes/entities/wish.entity';
import { WishlistEntity } from 'src/wishlists/entities/wishlist.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    private readonly hashService: HashService,
  ) {}

  async create(dto: CreateUserDto): Promise<UserEntity> {
    const newUser = this.usersRepository.create({
      ...dto,
      password: await this.hashService.hash(dto.password),
    });
    return this.usersRepository.save(newUser);
  }

  async findAll(): Promise<UserEntity[]> {
    return this.usersRepository.find();
  }

  async findUser(searchQuery: string): Promise<UserEntity> {
    return this.usersRepository.findOne({
      where: [{ username: searchQuery }, { email: searchQuery }],
    });
  }

  async findMany(searchQuery: string): Promise<UserEntity[]> {
    return this.usersRepository.find({
      where: [{ username: searchQuery }, { email: searchQuery }],
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

  async updateById(id: number, dto: UpdateUserDto): Promise<UpdateResult> {
    if (dto.password) dto.password = await this.hashService.hash(dto.password);

    return this.usersRepository.update(id, dto);
  }

  async deleteById(id: number): Promise<DeleteResult> {
    return this.usersRepository.delete(id);
  }

  async getUserWishes(id: number): Promise<WishEntity[]> {
    const { wishes } = await this.usersRepository.findOne({
      where: { id },
      select: ['wishes'],
      relations: ['wishes'],
    });

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
