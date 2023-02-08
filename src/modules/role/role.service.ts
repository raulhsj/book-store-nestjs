import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './role.entity';
import { Repository } from 'typeorm';
import { StatusType } from '../../shared/statustype.enum';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly _roleRepository: Repository<Role>,
  ) {}

  async get(id: number): Promise<Role> {
    if (!id) {
      throw new BadRequestException('id must be sent');
    }
    const role = await this._roleRepository.findOneBy({
      status: StatusType.ACTIVE,
      id,
    });

    if (!role) {
      throw new NotFoundException();
    }

    return role;
  }

  async getAll(): Promise<Role[]> {
    const roles: Role[] = await this._roleRepository.findBy({
      status: StatusType.ACTIVE,
    });

    return roles;
  }

  async create(role: Role): Promise<Role> {
    const savedRole: Role = await this._roleRepository.save(role);
    return savedRole;
  }

  async update(id: number, role: Role): Promise<void> {
    await this._roleRepository.update(id, role);
  }

  async delete(id: number): Promise<void> {
    const roleExists = await this._roleRepository.findOneBy({
      status: StatusType.ACTIVE,
    });

    if (!roleExists) {
      throw new NotFoundException();
    }
    await this._roleRepository.update(id, { status: StatusType.INACTIVE });
  }
}
