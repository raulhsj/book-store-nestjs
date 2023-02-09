import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './role.entity';
import { Repository } from 'typeorm';
import { StatusType } from '../../shared/statustype.enum';
import { ReadRoleDto } from './dtos';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly _roleRepository: Repository<Role>,
  ) {}

  async get(id: number): Promise<ReadRoleDto> {
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

    return plainToInstance(ReadRoleDto, role);
  }

  async getAll(): Promise<ReadRoleDto[]> {
    const roles: Role[] = await this._roleRepository.findBy({
      status: StatusType.ACTIVE,
    });

    return roles.map((role: Role) => plainToInstance(ReadRoleDto, role));
  }

  async create(role: Partial<Role>): Promise<ReadRoleDto> {
    const savedRole: Role = await this._roleRepository.save(role);
    return plainToInstance(ReadRoleDto, savedRole);
  }

  async update(roleId: number, role: Partial<Role>): Promise<ReadRoleDto> {
    const foundRole: Role = await this._roleRepository.findOneBy({
      id: roleId,
      status: StatusType.ACTIVE,
    });

    if (!foundRole) {
      throw new NotFoundException('This role does not exist');
    }

    foundRole.name = role.name;
    foundRole.description = role.description;
    const updatedRole: Role = await this._roleRepository.save(foundRole);
    return plainToInstance(ReadRoleDto, updatedRole);
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
