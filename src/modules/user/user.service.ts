import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { Role } from '../role/role.entity';
import { StatusType } from '../../shared/statustype.enum';
import { ReadUserDto, UpdateUserDto } from './dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly _userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly _roleRepository: Repository<Role>,
  ) {}

  async get(userId: number): Promise<ReadUserDto> {
    if (!userId) {
      throw new BadRequestException('id must be sent');
    }
    const user = await this._userRepository.findOneBy({
      status: StatusType.ACTIVE,
      id: userId,
    });

    if (!user) {
      throw new NotFoundException();
    }

    return plainToInstance(ReadUserDto, user);
  }

  async getAll(): Promise<ReadUserDto[]> {
    const users: User[] = await this._userRepository.findBy({
      status: StatusType.ACTIVE,
    });

    return users.map((user: User) => plainToInstance(ReadUserDto, user));
  }

  async update(userId: number, user: UpdateUserDto): Promise<ReadUserDto> {
    const foundUser = await this._userRepository.findOneBy({
      id: userId,
      status: StatusType.ACTIVE,
    });

    if (!foundUser) {
      throw new NotFoundException('User does not exist');
    }

    foundUser.username = user.username;
    const updatedUser = await this._userRepository.save(foundUser);
    return plainToInstance(ReadUserDto, updatedUser);
  }

  async delete(userId: number): Promise<void> {
    const userExists = await this._userRepository.findOneBy({
      id: userId,
      status: StatusType.ACTIVE,
    });

    if (!userExists) {
      throw new NotFoundException();
    }
    await this._userRepository.update(userId, { status: StatusType.INACTIVE });
  }

  async setRoleToUser(userId: number, roleId: number): Promise<boolean> {
    const userExist = await this._userRepository.findOneBy({
      id: userId,
      status: StatusType.ACTIVE,
    });

    if (!userExist) {
      throw new NotFoundException();
    }

    const roleExist = await this._roleRepository.findOneBy({
      id: roleId,
      status: StatusType.ACTIVE,
    });

    if (!roleExist) {
      throw new NotFoundException('Role does not exist');
    }

    userExist.roles.push(roleExist);
    await this._userRepository.save(userExist);

    return true;
  }
}
