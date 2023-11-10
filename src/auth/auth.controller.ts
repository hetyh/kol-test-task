import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService, Public } from './auth.service';
import { SignInUserDto } from './dto/sign-in-user.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('users')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: SignInUserDto) {
    return this.authService.signIn(signInDto);
  }
}
