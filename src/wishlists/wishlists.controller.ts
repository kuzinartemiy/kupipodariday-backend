import {
  Controller,
  Post,
  Get,
  UseGuards,
  Body,
  Req,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { DeleteResult } from 'typeorm';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { WishlistEntity } from './entities/wishlist.entity';
import { WishlistsService } from './wishlists.service';

@Controller('wishlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createWishlist(
    @Req() { user },
    @Body() dto: CreateWishlistDto,
  ): Promise<WishlistEntity> {
    return await this.wishlistsService.create(dto, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getWishlists(): Promise<WishlistEntity[]> {
    return await this.wishlistsService.findAllWishlists();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getWishlistById(@Param('id') id: number): Promise<WishlistEntity> {
    return await this.wishlistsService.findWishlistById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateWishlist(
    @Req() { user },
    @Param('id') id: number,
    @Body() dto: UpdateWishlistDto,
  ): Promise<WishlistEntity> {
    return await this.wishlistsService.updateWishlist(id, dto, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteWishlist(
    @Req() { user },
    @Param('id') id: number,
  ): Promise<DeleteResult> {
    return await this.wishlistsService.deleteWishlist(id, user.id);
  }
}
