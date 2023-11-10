import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  author: string;

  @ApiProperty()
  @IsString()
  publish_year: string;

  @ApiProperty()
  @IsString()
  description: string;
}
