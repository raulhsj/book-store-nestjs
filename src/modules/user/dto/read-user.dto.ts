import { IsEmail, IsNumber, IsString } from 'class-validator';
import { ReadUserDetailsDto } from './read-user-details.dto';
import { Exclude, Expose, Type } from 'class-transformer';
import { ReadRoleDto } from '../../role/dtos';

@Exclude()
export class ReadUserDto {
  @Expose()
  @IsNumber()
  readonly id: number;

  @Expose()
  @IsEmail()
  readonly email: string;

  @Expose()
  @IsString()
  readonly username: string;

  @Expose()
  @Type((type) => ReadUserDetailsDto) // automatic cast to ReadUserDetailsDto
  readonly details: ReadUserDetailsDto;

  @Expose()
  @Type(() => ReadRoleDto)
  readonly roles: ReadRoleDto[];
}
