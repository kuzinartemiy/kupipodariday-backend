import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { DeleteResult, In, Repository, UpdateResult } from 'typeorm';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { WishEntity } from './entities/wish.entity';
import {
  USER_NOT_FOUND_ERROR,
  USER_NOT_WISH_OWNER_ERROR,
  WISH_NOT_FOUND_ERROR,
  WISH_RAISED_NOT_NULL_ERROR,
} from './wishes.constants';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(WishEntity)
    private readonly wishesRepository: Repository<WishEntity>,
    private readonly usersService: UsersService,
  ) {}

  async createWish(dto: CreateWishDto, owner: UserEntity): Promise<WishEntity> {
    delete owner.password;
    const newWish = this.wishesRepository.create({
      ...dto,
      owner,
    });
    return this.wishesRepository.save(newWish);
  }

  async findAll(): Promise<WishEntity[]> {
    return this.wishesRepository.find();
  }

  async findLastWishes(): Promise<WishEntity[]> {
    return this.wishesRepository.find({
      take: 40,
      order: { createdAt: 'desc' },
    });
  }

  async findTopWishes(): Promise<WishEntity[]> {
    return this.wishesRepository.find({
      take: 10,
      order: { copied: 'desc' },
    });
  }

  async findWishById(id: number): Promise<WishEntity> {
    return this.wishesRepository.findOne({
      where: { id },
      relations: {
        owner: { wishes: true },
      },
    });
  }

  async updateWish(
    wishId: number,
    dto: UpdateWishDto,
    userId: number,
  ): Promise<UpdateResult> {
    const wish = await this.findWishById(wishId);
    if (!wish) throw new BadRequestException(WISH_NOT_FOUND_ERROR);
    if (wish.raised) throw new BadRequestException(WISH_RAISED_NOT_NULL_ERROR);

    if (wish.owner.id !== userId) {
      throw new BadRequestException(USER_NOT_WISH_OWNER_ERROR);
    }

    return this.wishesRepository.update(wishId, dto);
  }

  async deleteWishById(wishId: number, userId: number): Promise<DeleteResult> {
    const wish = await this.findWishById(wishId);
    if (!wish) throw new BadRequestException(WISH_NOT_FOUND_ERROR);
    if (wish.raised) throw new BadRequestException(WISH_RAISED_NOT_NULL_ERROR);

    if (wish.owner.id !== userId) {
      throw new BadRequestException(USER_NOT_WISH_OWNER_ERROR);
    }

    return this.wishesRepository.delete(wishId);
  }

  async copyWish(wishId: number, userId: number): Promise<WishEntity> {
    const wish = await this.wishesRepository.findOneBy({ id: wishId });
    if (!wish) throw new NotFoundException(WISH_NOT_FOUND_ERROR);
    delete wish.id;
    delete wish.createdAt;
    delete wish.updatedAt;

    const user = await this.usersService.findUserById(userId);
    if (!user) throw new NotFoundException(USER_NOT_FOUND_ERROR);
    delete user.password;

    await this.wishesRepository.update(wishId, {
      copied: (wish.copied += 1),
    });

    const wishCopy = {
      ...wish,
      owner: user,
      copied: 0,
      raised: null,
      offers: [],
    };

    return await this.createWish(wishCopy, user);
  }

  async updateWishRaised(id: number, raised: number): Promise<UpdateResult> {
    return this.wishesRepository.update(id, { raised });
  }

  async findWishesByIds(ids: number[]): Promise<WishEntity[]> {
    return this.wishesRepository.find({
      where: { id: In(ids) },
    });
  }
}
