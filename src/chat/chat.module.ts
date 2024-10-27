import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Chat, ChatSchema } from 'src/schemas/chat.schema';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
  ],

  controllers: [ChatController],
  providers: [ChatService, JwtStrategy],
})
export class ChatModule {}