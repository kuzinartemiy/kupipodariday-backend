import { IsBoolean } from 'class-validator';
import { User } from 'src/users/user.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Offer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user: User;

  @Column()
  item: User;

  @Column()
  amount: number;

  @Column()
  @IsBoolean()
  hidden: boolean;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
}
