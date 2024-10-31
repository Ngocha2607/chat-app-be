import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { RegisterUserDto } from './dto/register-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthResponseDto, LoginUserDto } from './dto/login-user.dto';
import { UserProfileDto } from './dto/user-profile.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async register(registerUserDto: RegisterUserDto): Promise<User> {
    const { username, password } = registerUserDto;
    // Check if user already exists
    const existingUser = await this.userModel.findOne({ username });
    if (existingUser) {
      throw new Error('User already exists');
    } else {
      // Hash the password
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create a new user
      const newUser = new this.userModel({
        username,
        password: hashedPassword,
      });
      return newUser.save();
    }
  }
  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.userModel.findOne({ username }).exec();

    if (!user) {
      return null;
    }
    const isMatchPassword = await bcrypt.compare(password, user.password);
    if (!isMatchPassword) {
      return null;
    }

    return user;
  }

  async login(loginUserDto: LoginUserDto): Promise<AuthResponseDto> {
    const { username, password } = loginUserDto;
    const user = await this.validateUser(username, password);
    if (!user) {
      throw new Error('Invalid username or password');
    }
    const payload = { username: user.username, sub: user._id };
    return {
      token: this.jwtService.sign(payload),
      user: {
        _id: user._id,
        username: user.username,
      },
    };
  }

  async getUserProfile(id: number): Promise<UserProfileDto> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new Error('User not found');
    }
    return {
      _id: user._id,
      username: user.username,
    };
  }

  async getListUsers(): Promise<UserProfileDto[]> {
    return this.userModel.find().exec();
  }
  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new Error('User not found');
    }

    if (updateUserDto.username) {
      user.username = updateUserDto.username;
    }

    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt();
      user.password = await bcrypt.hash(updateUserDto.password, salt);
    }

    return user.save();
  }
}
