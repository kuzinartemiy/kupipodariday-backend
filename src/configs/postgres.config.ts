import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { OfferEntity } from 'src/offers/offer.entity';
import { UserEntity } from 'src/users/users.entity';
import { WishEntity } from 'src/wishes/wish.entity';
import { WishlistEntity } from 'src/wishlists/wishlist.entity';

export const getPostgresConfig = async (
  configService: ConfigService,
): Promise<TypeOrmModuleOptions> => {
  return {
    type: 'postgres',
    host: configService.get('POSTGRES_HOST'),
    port: configService.get('POSTGRES_PORT'),
    username: configService.get('POSTGRES_USERNAME'),
    password: configService.get('POSTGRES_PASSWORD'),
    database: configService.get('POSTGRES_DB'),
    entities: [UserEntity, OfferEntity, WishEntity, WishlistEntity],
    synchronize: true,
  };
};
