import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { User } from 'src/schemas/user.schema';
import { AuthResponseDto, LoginUserDto } from './dto/login-user.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UserProfileDto } from './dto/user-profile.dto';
import { UpdateUserDto } from './dto/update-user.dto';

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
  async login(@Body() loginUserDto: RegisterUserDto): Promise<AuthResponseDto> {
    return this.authService.login(loginUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req): Promise<UserProfileDto> {
    console.log(req.user);
    return this.authService.getUserProfile(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('list')
  async getListUsers(): Promise<UserProfileDto[]> {
    return this.authService.getListUsers();
  }
  @UseGuards(JwtAuthGuard)
  @Put('update')
  async updateProfile(
    @Request() req,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.authService.updateUser(req.user.userId, updateUserDto);
  }
}
