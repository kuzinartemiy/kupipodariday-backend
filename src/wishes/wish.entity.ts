import { Length, IsString, IsUrl } from 'class-validator';
import { OfferEntity } from 'src/offers/offer.entity';
import { UserEntity } from 'src/users/users.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('wishes')
export class WishEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 250 })
  @IsString()
  @Length(1, 250)
  name: string;

  @Column()
  @IsUrl()
  link: string;

  @Column()
  @IsUrl()
  image: string;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  price: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  raised: number;

  @ManyToOne(() => UserEntity, (user) => user.wishes)
  @JoinColumn()
  owner: UserEntity;

  @Column({ length: 1024 })
  @IsString()
  @Length(1, 1024)
  description: string;

  @OneToMany(() => OfferEntity, (offer) => offer.item)
  offers: OfferEntity[];

  @Column('int')
  copied: number;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
}
