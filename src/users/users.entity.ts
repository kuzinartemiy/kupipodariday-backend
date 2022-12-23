import { Length, IsEmail, IsString, IsDate } from 'class-validator';
import { OfferEntity } from 'src/offers/offer.entity';
import { WishEntity } from 'src/wishes/wish.entity';
import { WishlistEntity } from 'src/wishlists/wishlist.entity';
import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {
  USER_ABOUT_DEFAULT_TEXT,
  USER_AVATAR_DEFAULT_LINK,
} from './users.constants';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 30 })
  @IsString()
  @Length(2, 30)
  username: string;

  @Column({
    length: 200,
    default: USER_ABOUT_DEFAULT_TEXT,
  })
  @IsString()
  @Length(2, 200)
  about: string;

  @Column({ default: USER_AVATAR_DEFAULT_LINK })
  @IsString()
  avatar: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  @IsString()
  password: string;

  @OneToMany(() => WishEntity, (wish) => wish.owner)
  wishes: WishEntity[];

  @OneToMany(() => OfferEntity, (offer) => offer.user)
  offers: OfferEntity[];

  @OneToOne(() => WishlistEntity, (wishlist) => wishlist.id)
  wishlists: WishlistEntity[];

  @Column()
  @IsDate()
  createdAt: Date;

  @Column()
  @IsDate()
  updatedAt: Date;
}
