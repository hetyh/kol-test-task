import { PartialType } from '@nestjs/mapped-types';
import { CreateBookDto } from './create-book.dto';
import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateBookDto extends PartialType(CreateBookDto) {
  @ApiProperty()
  @IsString()
  name?: string;

  @ApiProperty()
  @IsString()
  author?: string;

  @ApiProperty()
  @IsString()
  publish_year?: string;

  @ApiProperty()
  @IsString()
  description?: string;
}
