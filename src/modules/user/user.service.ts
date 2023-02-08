import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { UserDetails } from './user.details.entity';
import { Role } from '../role/role.entity';
import { StatusType } from '../../shared/statustype.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly _userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly _roleRepository: Repository<Role>,
  ) {}

  async get(id: number): Promise<User> {
    if (!id) {
      throw new BadRequestException('id must be sent');
    }
    const user = await this._userRepository.findOneBy({
      status: StatusType.ACTIVE,
      id,
    });

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async getAll(): Promise<User[]> {
    const users: User[] = await this._userRepository.findBy({
      status: StatusType.ACTIVE,
    });

    return users;
  }

  async create(user: User): Promise<User> {
    const details = new UserDetails();
    user.details = details;

    const defaultRole = await this._roleRepository.findOneBy({
      name: 'GENERAL',
    });
    user.roles = [defaultRole];

    const savedUser: User = await this._userRepository.save(user);
    return savedUser;
  }

  async update(id: number, user: User): Promise<void> {
    await this._userRepository.update(id, user);
  }

  async delete(id: number): Promise<void> {
    const userExists = await this._userRepository.findOneBy({
      status: StatusType.ACTIVE,
    });

    if (!userExists) {
      throw new NotFoundException();
    }
    await this._userRepository.update(id, { status: StatusType.INACTIVE });
  }
}
