import { User } from 'src/users/user.entity';
// import { IsArray } from 'class-validator';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Wish {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  link: string;

  @Column()
  image: URL;

  @Column()
  price: number;

  @Column()
  raised: number;

  @OneToOne(() => User)
  @JoinColumn()
  owner: User;

  @Column()
  description: string;

  // @Column()
  // @IsArray({ each: true })
  // offers: Offer[];

  @Column()
  copied: number;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
}
