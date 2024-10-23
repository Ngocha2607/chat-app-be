import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { User } from 'src/schemas/user.schema';

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
  @Post('login')
  async login(
    @Body() loginUserDto: RegisterUserDto,
  ): Promise<{ token: string }> {
    return this.authService.login(loginUserDto);
  }
}
