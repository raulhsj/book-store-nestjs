import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { SharedModule } from '../../shared/shared.module';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { Role } from '../role/role.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Role]),
    SharedModule,
    AuthModule,
  ],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
