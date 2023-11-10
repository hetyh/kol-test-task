import { Injectable, SetMetadata, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { SignInUserDto } from './dto/sign-in-user.dto';
import { JwtService } from '@nestjs/jwt';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(signInDto: SignInUserDto) {
    const user = await this.usersService.findOneByEmail(signInDto.email);

    if (
      user == null ||
      !(await bcrypt.compare(signInDto.password, user.password))
    ) {
      throw new UnauthorizedException();
    }

    const payload = { id: user.id, email: user.email };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
