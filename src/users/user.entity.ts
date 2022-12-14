import { IsEmail, IsArray } from 'class-validator';
import { Wishlist } from 'src/wishlists/wishlist.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  about: string;

  @Column()
  avatar: URL;

  @Column()
  @IsEmail()
  email: string;

  @Column()
  password: string;

  @Column()
  wishes: any[];

  @Column()
  offers: any[];

  @OneToOne(() => Wishlist, (wishlist) => wishlist.id)
  @IsArray({ each: true })
  wishlists: Wishlist[];

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
}
