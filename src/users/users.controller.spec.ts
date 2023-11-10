import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';

describe('UsersController', () => {
  let controller: UsersController;

  let userRepository: Repository<User>;
  let userService: UsersService;

  // eslint-disable-next-line @typescript-eslint/ban-types
  const userRepositoryToken: string | Function = getRepositoryToken(User);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: userRepositoryToken,
          useClass: Repository,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    userRepository = module.get<Repository<User>>(userRepositoryToken);
    userService = module.get<UsersService>(UsersService);
  });

  describe('create', () => {
    it('should return user', async () => {
      const userDto = {
        email: 'test@mail.com',
        password: '_Test2023',
        name: 'Test',
      } as CreateUserDto;

      const createdUser = {
        id: 1,
        name: 'test',
        email: 'test@gmail.com',
        password: '',
      } as User;

      jest.spyOn(userService, 'create').mockResolvedValueOnce(createdUser);

      const result = await controller.create(userDto);

      expect(result).toBe(createdUser);
    });
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
