import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from './books.service';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UpdateBookDto } from './dto/update-book.dto';
import { User } from '../users/entities/user.entity';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';

describe('BooksService', () => {
  let service: BooksService;
  let bookRepository: Repository<Book>;

  // eslint-disable-next-line @typescript-eslint/ban-types
  const bookRepositoryToken: string | Function = getRepositoryToken(Book);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: bookRepositoryToken,
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
    bookRepository = module.get<Repository<Book>>(bookRepositoryToken);
  });

  const books = [
    {
      id: 1,
      name: 'test',
      author: 'Test Testovich',
      publish_year: '1984',
      description: 'lorem ipsum ...',
      user: {
        id: 1,
      },
    },
    {
      id: 2,
      name: 'test 2: electric boogaloo',
      author: 'Test Testov',
      publish_year: '2020',
      description: 'bla bla bla',
      user: {
        id: 2,
      },
    },
  ] as Book[];

  describe('findAll', () => {
    it('should return all books', async () => {
      const resultBooks = books.map(function (book) {
        return { id: book.id, name: book.name } as Book;
      });

      jest.spyOn(bookRepository, 'find').mockResolvedValueOnce(resultBooks);

      const result = await service.findAll({
        take: undefined,
        skip: undefined,
        publish_year: undefined,
        author: undefined,
      });

      expect(result).toBe(resultBooks);
    });
  });

  describe('findOne', () => {
    it('should return one book if it exist', async () => {
      const resultBook = books.find((book) => (book.id = 1));

      jest.spyOn(bookRepository, 'findOneBy').mockResolvedValueOnce(resultBook);

      const result = await service.findOne(1);

      expect(result).toBe(resultBook);
    });
  });

  describe('update', () => {
    const updateDto = {
      name: 'new name',
      description: 'new description',
    } as UpdateBookDto;

    it('should throw NotFoundException if book does not exist', async () => {
      const bookId = 109283012;

      jest.spyOn(bookRepository, 'findOne').mockResolvedValueOnce(null);

      expect(async () => {
        await service.update(
          { id: 1, email: 'test@test.test' } as User,
          bookId,
          updateDto,
        );
      }).rejects.toThrow(NotFoundException);
    });

    it('should throw UnauthorizedException if book does not belong to user', async () => {
      const bookId = 1;
      const book = books.find((book) => (book.id = bookId));

      jest.spyOn(bookRepository, 'findOne').mockResolvedValueOnce(book);

      expect(async () => {
        await service.update(
          { id: 2, email: 'test@test.test' } as User,
          bookId,
          updateDto,
        );
      }).rejects.toThrow(UnauthorizedException);
    });

    it('should return if book is updated', async () => {
      const bookId = 1;
      const book = books.find((book) => (book.id = bookId));
      const updatedBook = { ...book, ...updateDto } as Book;

      jest.spyOn(bookRepository, 'findOne').mockResolvedValueOnce(book);
      jest.spyOn(bookRepository, 'save').mockResolvedValueOnce(updatedBook);

      await service.update(
        { id: 1, email: 'test@test.test' } as User,
        bookId,
        updateDto,
      );

      expect(bookRepository.save).toHaveBeenCalledWith(updatedBook);
      expect(bookRepository.save).toHaveReturned();
    });
  });

  describe('remove', () => {
    it('should throw NotFoundException if book does not exist', async () => {
      const bookId = 109283012;

      jest.spyOn(bookRepository, 'findOne').mockResolvedValueOnce(null);

      expect(async () => {
        await service.remove(
          { id: 1, email: 'test@test.test' } as User,
          bookId,
        );
      }).rejects.toThrow(NotFoundException);
    });

    it('should throw UnauthorizedException if book does not belong to user', async () => {
      const bookId = 1;
      const book = books.find((book) => (book.id = bookId));

      jest.spyOn(bookRepository, 'findOne').mockResolvedValueOnce(book);

      expect(async () => {
        await service.remove(
          { id: 2, email: 'test@test.test' } as User,
          bookId,
        );
      }).rejects.toThrow(UnauthorizedException);
    });

    it('should return if book is removed', async () => {
      const bookId = 1;
      const book = books.find((book) => (book.id = bookId));

      jest.spyOn(bookRepository, 'findOne').mockResolvedValueOnce(book);
      jest.spyOn(bookRepository, 'remove').mockResolvedValueOnce(book);

      await service.remove({ id: 1, email: 'test@test.test' } as User, bookId);

      expect(bookRepository.remove).toHaveBeenCalledWith(book);
      expect(bookRepository.remove).toHaveReturned();
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
