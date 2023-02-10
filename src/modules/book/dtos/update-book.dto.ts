import { IsString } from 'class-validator';

export class UpdateBookDto {
  @IsString()
  readonly title: string;

  @IsString()
  readonly description: string;
}
