import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { Request } from '@nestjs/common';
import { Public } from '../auth/auth.service';

@ApiBearerAuth()
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  create(@Request() req, @Body() createBookDto: CreateBookDto) {
    return this.booksService.create(req.user, createBookDto);
  }

  @Public()
  @Get()
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'author', required: false, type: String })
  @ApiQuery({ name: 'publish_year', required: false, type: String })
  findAll(
    @Query('take', new ParseIntPipe({ optional: true }))
    take?: number,
    @Query('skip', new ParseIntPipe({ optional: true }))
    skip?: number,
    @Query('author')
    author?: string,
    @Query('publish_year')
    publish_year?: string,
  ) {
    return this.booksService.findAll({ take, skip, author, publish_year });
  }

  @Public()
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.booksService.findOne(+id);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(':id')
  update(
    @Request() req,
    @Param('id', ParseIntPipe) id: string,
    @Body() updateBookDto: UpdateBookDto,
  ) {
    return this.booksService.update(req.user, +id, updateBookDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(@Request() req, @Param('id', ParseIntPipe) id: string) {
    return this.booksService.remove(req.user, +id);
  }
}
