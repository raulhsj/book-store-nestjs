import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserDetails } from './user.details.entity';
import { Role } from '../role/role.entity';
import { StatusType } from '../../shared/statustype.enum';
import { CreationDate } from '../../shared/creationDate.entity';
import { Book } from '../book/book.entity';

@Entity('users')
export class User extends CreationDate {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', unique: true, length: 25, nullable: false })
  username: string;

  @Column({ type: 'varchar', nullable: false })
  email: string;

  @Column({ type: 'varchar', default: StatusType.ACTIVE })
  password: string;

  @OneToOne(() => UserDetails, {
    cascade: true,
    nullable: false,
    eager: true,
  })
  @JoinColumn({ name: 'detail_id' })
  details: UserDetails;

  @ManyToMany(() => Role, (role) => role.users, { eager: true })
  @JoinTable({ name: 'user_roles' })
  roles: Role[];

  @ManyToMany(() => Book, (book) => book.authors)
  @JoinTable({ name: 'user_books' })
  books: Book[];
}
