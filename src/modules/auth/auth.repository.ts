import { DataSource, Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { SignupDto } from './dto';
import { Role } from '../role/role.entity';
import { RoleType } from '../role/roletype.enum';
import { genSalt, hash } from 'bcryptjs';
import { UserDetails } from '../user/user.details.entity';
import { Injectable } from '@nestjs/common';

/*
  TypeORM ^0.3.x repository customizing:
  ... extends Repository<Entity>
  ... constructor(private dataSource: DataSource) {
    super(<Entity>, dataSource.createEntityManager());
  }
  In <module_name>.module.ts -> add <EntityRepository> to providers
  No need to @InjectRepository(<Entity>) in services
*/
@Injectable()
export class AuthRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async signUp(signupDto: SignupDto) {
    const { username, email, password } = signupDto;
    const user = new User();
    user.username = username;
    user.email = email;

    const roleRepository = await this.dataSource.getRepository(Role);

    const defaultRole: Role = await roleRepository.findOneBy({
      name: RoleType.GENERAL,
    });

    user.roles = [defaultRole];

    const details = new UserDetails();
    user.details = details;

    const salt = await genSalt(10);
    user.password = await hash(password, salt);

    await user.save();
  }
}
