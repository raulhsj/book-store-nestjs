import { IsEmail, IsNumber, IsString } from 'class-validator';
import { ReadUserDetailsDto } from './read-user-details.dto';
import { Type } from 'class-transformer';

export class ReadUserDto {
  @IsNumber()
  readonly id: number;

  @IsEmail()
  readonly email: string;

  @IsString()
  readonly username: string;

  @Type((type) => ReadUserDetailsDto) // automatic cast to ReadUserDetailsDto
  readonly details: ReadUserDetailsDto;
}
