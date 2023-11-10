import { Test, TestingModule } from '@nestjs/testing';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/entities/user.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

describe('BooksController', () => {
  let controller: BooksController;

  let bookRepository: Repository<Book>;
  let bookService: BooksService;

  // eslint-disable-next-line @typescript-eslint/ban-types
  const bookRepositoryToken: string | Function = getRepositoryToken(Book);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [
        BooksService,
        {
          provide: bookRepositoryToken,
          useClass: Repository,
        },
      ],
    }).compile();

    controller = module.get<BooksController>(BooksController);
    bookRepository = module.get<Repository<Book>>(bookRepositoryToken);
    bookService = module.get<BooksService>(BooksService);
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

  describe('create', () => {
    it('should create book', async () => {
      const user = {
        id: 1,
        email: 'test@mail.com',
      } as User;

      const bookDto = {
        name: 'test',
        author: 'Test Testovich',
        publish_year: '1984',
        description: 'lorem ipsum ...',
      } as CreateBookDto;

      const createdBook = {
        ...bookDto,
        id: 1,
        user: {
          id: 1,
        },
      } as Book;

      jest.spyOn(bookService, 'create').mockResolvedValueOnce(createdBook);

      const result = await controller.create(user, bookDto);

      expect(result).toBe(createdBook);
    });
  });

  describe('findAll', () => {
    it('should find all books', async () => {
      jest.spyOn(bookService, 'findAll').mockResolvedValueOnce(books);

      const result = await controller.findAll();

      expect(result).toBe(books);
    });
  });

  describe('findOne', () => {
    it('should find book if it exist', async () => {
      const bookId = 1;
      const resultBook = books.find((book) => (book.id = bookId));

      jest.spyOn(bookService, 'findOne').mockResolvedValueOnce(resultBook);

      const result = await controller.findOne(String(bookId));

      expect(result).toBe(resultBook);
    });
  });

  describe('update', () => {
    it('should update book if it exist', async () => {
      const bookId = 1;
      const user = {
        id: 1,
        email: 'test@mail.com',
      } as User;

      const bookDto = {
        name: 'test',
        author: 'Test Testovich',
        publish_year: '1984',
        description: 'lorem ipsum ...',
      } as UpdateBookDto;

      jest.spyOn(bookService, 'update').mockResolvedValueOnce();

      await controller.update(user, String(bookId), bookDto);

      expect(bookService.update).toHaveReturned();
    });
  });

  describe('delete', () => {
    it('should delete book if it exist', async () => {
      const bookId = 1;
      const user = {
        id: 1,
        email: 'test@mail.com',
      } as User;

      jest.spyOn(bookService, 'remove').mockResolvedValueOnce();

      await controller.remove(user, String(bookId));

      expect(bookService.remove).toHaveReturned();
    });
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
