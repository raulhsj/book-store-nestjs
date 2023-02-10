import { CreationDate } from '../../shared/creationDate.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../user/user.entity';

@Entity('books')
export class Book extends CreationDate {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  title: string;

  @Column({ type: 'varchar', length: 500 })
  description: string;

  @ManyToMany(() => User, (user) => user.books, { eager: true })
  @JoinColumn()
  authors: User[];
}
