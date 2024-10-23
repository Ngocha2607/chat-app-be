import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { RegisterUserDto } from './dto/register-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/login-user.dto';

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
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async login(loginUserDto: LoginUserDto): Promise<{ token: string }> {
    const { username, password } = loginUserDto;
    const user = await this.validateUser(username, password);
    if (!user) {
      throw new Error('Invalid username or password');
    }
    const payload = { username: user.username, sub: user._id };
    const token = this.jwtService.sign(payload);
    return { token };
  }
}
