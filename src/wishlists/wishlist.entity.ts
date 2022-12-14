import { Wish } from 'src/wishes/wish.entity';
import { IsArray } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Wishlist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  image: URL;

  @Column()
  @IsArray({ each: true })
  items: Wish[];

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
}
