import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { FileService } from './file/file.service';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    MongooseModule.forRoot('mongodb://localhost/chat-app'),
    // MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    AuthModule,
    ChatModule,
  ],
  providers: [FileService],
})
export class AppModule {}
