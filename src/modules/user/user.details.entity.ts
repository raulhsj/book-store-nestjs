import { CreationDate } from '../../shared/creationDate.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user_details')
export class UserDetails extends CreationDate {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  lastname: string;
}
