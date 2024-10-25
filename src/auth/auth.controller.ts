import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { User } from 'src/schemas/user.schema';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get()
  async getHello(): Promise<string> {
    return 'Hello';
  }
  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto): Promise<User> {
    return this.authService.register(registerUserDto);
  }
<<<<<<< HEAD
  @Post('login')
  async login(
    @Body() loginUserDto: RegisterUserDto,
  ): Promise<{ token: string }> {
=======

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto): Promise<{ token: string }> {
>>>>>>> 7738a3e8f81c8cbf75de6d8046a10c44ccab6c7e
    return this.authService.login(loginUserDto);
  }
}
