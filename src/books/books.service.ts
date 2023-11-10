import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private booksRepository: Repository<Book>,
  ) {}
  async create(user: User, createBookDto: CreateBookDto) {
    const result = await this.booksRepository.save({ ...createBookDto, user });

    return {
      ...result,
      user: {
        id: user.id,
        email: user.email,
      },
    } as Book;
  }

  async findAll(settings?: {
    take?: number;
    skip?: number;
    author?: string;
    publish_year?: string;
  }) {
    return await this.booksRepository.find({
      select: { id: true, name: true },
      where: { author: settings.author, publish_year: settings.publish_year },
      take: settings.take,
      skip: settings.skip,
    });
  }

  async findOne(id: number) {
    return await this.booksRepository.findOneBy({ id });
  }

  async update(user: User, id: number, updateBookDto: UpdateBookDto) {
    const book = await this.booksRepository.findOne({
      where: { id },
      relations: { user: true },
    });

    if (book == null) {
      throw new NotFoundException();
    }

    if (book.user.id !== user.id) {
      throw new UnauthorizedException();
    }

    await this.booksRepository.save({ ...book, ...updateBookDto });
  }

  async remove(user: User, id: number) {
    const book = await this.booksRepository.findOne({
      where: { id },
      relations: { user: true },
    });

    if (book == null) {
      throw new NotFoundException();
    }

    if (book.user.id !== user.id) {
      throw new UnauthorizedException();
    }

    await this.booksRepository.remove(book);
  }
}
