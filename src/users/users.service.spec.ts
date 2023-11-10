import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<User>;

  // eslint-disable-next-line @typescript-eslint/ban-types
  const userRepositoryToken: string | Function = getRepositoryToken(User);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: userRepositoryToken,
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(userRepositoryToken);
  });

  describe('create', () => {
    it('should return User if user is created', async () => {
      const userDto = {
        name: 'test',
        email: 'test@gmail.com',
        password: '_Test2023',
      } as CreateUserDto;

      const createdUser = {
        id: 1,
        name: 'test',
        email: 'test@gmail.com',
        password: 'bcrypthash',
        books: [],
      } as User;

      jest.spyOn(userRepository, 'save').mockResolvedValueOnce(createdUser);

      const result = await service.create(userDto);

      expect(result).toStrictEqual({ ...createdUser, password: '' } as User);
      expect(userRepository.save).toHaveBeenCalled();
    });
  });

  describe('findOneByEmail', () => {
    it('should return user if it exist', async () => {
      const existingUser = { id: 1, email: 'test@gmail.com' } as User;

      jest
        .spyOn(userRepository, 'findOneBy')
        .mockResolvedValueOnce(existingUser);

      const result = await service.findOneByEmail('test@gmail.com');

      expect(result).toBe(existingUser);
      expect(userRepository.findOneBy).toHaveBeenCalledWith({
        email: 'test@gmail.com',
      });
    });

    it('should return null if user does not exist', async () => {
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValueOnce(null);

      const result = await service.findOneByEmail('test@gmail.com');

      expect(result).toBe(null);
      expect(userRepository.findOneBy).toHaveBeenCalledWith({
        email: 'test@gmail.com',
      });
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
