import { IsNumber, IsString } from 'class-validator';
import { Exclude, Expose, Type } from 'class-transformer';
import { ReadUserDto } from '../../user/dto';

@Exclude()
export class ReadBookDto {
  @Expose()
  @IsNumber()
  readonly id: number;

  @Expose()
  @IsString()
  readonly title: string;

  @Expose()
  @IsString()
  readonly description: string;

  @Expose()
  @Type(() => ReadUserDto)
  readonly authors: ReadUserDto[];
}
