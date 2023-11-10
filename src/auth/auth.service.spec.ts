import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SignInUserDto } from './dto/sign-in-user.dto';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;

  let userRepository: Repository<User>;
  let userService: UsersService;
  let jwtService: JwtService;

  // eslint-disable-next-line @typescript-eslint/ban-types
  const userRepositoryToken: string | Function = getRepositoryToken(User);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UsersService,
        JwtService,
        {
          provide: userRepositoryToken,
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<User>>(userRepositoryToken);
    userService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('signIn', () => {
    const users = [
      {
        id: 1,
        email: 'test@test.test',
        password:
          '$2b$10$BN0DrJc6W6TfzzfZvslzwuRUJe0bALbedSigOQFZ6zPCjGa43fHHS', // '_Test2023'
      },
      {
        id: 2,
        email: 'test2@test.test',
        password:
          '$2b$10$8HjyLY.bX/r3rI.rufPhrONsbV9HaP./89H3RJuu6qE6t7RVYyKqi', // '_Greg2023'
      },
    ] as User[];

    it('should throw UnauthorizedException if password is incorrect', () => {
      const signInDto = {
        email: 'test@test.test',
        password: '_Test2023_Incorrect',
      } as SignInUserDto;

      jest.spyOn(userService, 'findOneByEmail').mockResolvedValueOnce(users[0]);

      expect(async () => service.signIn(signInDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if user does not exist', () => {
      const signInDto = {
        email: 'test10@test.test',
        password: '_Test2023',
      } as SignInUserDto;

      jest.spyOn(userService, 'findOneByEmail').mockResolvedValueOnce(null);

      expect(async () => service.signIn(signInDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should return access_token', async () => {
      const signInDto = {
        email: 'test1@test.test',
        password: '_Test2023',
      } as SignInUserDto;

      const jwtToken = 'prettylongaccesstoken';

      jest.spyOn(userService, 'findOneByEmail').mockResolvedValueOnce(users[0]);
      jest.spyOn(jwtService, 'signAsync').mockResolvedValueOnce(jwtToken);

      const result = await service.signIn(signInDto);

      expect(result).toStrictEqual({ access_token: jwtToken });
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
