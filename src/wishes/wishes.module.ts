import { Module } from '@nestjs/common';
import { WishesService } from './wishes.service';
import { WishesController } from './wishes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WishEntity } from './wish.entity';

@Module({
  providers: [WishesService],
  controllers: [WishesController],
  imports: [TypeOrmModule.forFeature([WishEntity])],
})
export class WishesModule {}
