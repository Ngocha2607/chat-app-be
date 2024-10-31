import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Chat, ChatDocument } from 'src/schemas/chat.schema';
import { CreateChatDto } from './dto/create-chat.dto';
import { User, UserDocument } from 'src/schemas/user.schema';
import { SendMessageDto } from './dto/send-message.dto';
import { ChatModule } from './chat.module';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Chat.name) private chatModel: Model<ChatDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}
  async createChat(createChatDto: CreateChatDto): Promise<Chat> {
    const newChat = new this.chatModel({
      participants: createChatDto.participants,
      messages: [],
    });
    return newChat.save();
  }
  async getChats(userId: string): Promise<Chat[]> {
    return this.chatModel
      .find({ participants: userId })
      .populate('participants', 'username')
      .exec();
  }
  async getChatDetails(chatId: string): Promise<Chat> {
    return this.chatModel
      .findById(chatId)
      .populate('participants', 'username')
      .populate('messages.sender', 'username')
      .exec();
  }
  async sendMessage(
    chatId: string,
    userId: Types.ObjectId,
    sendMessageDto: SendMessageDto,
  ): Promise<Chat> {
    const chat = await this.chatModel.findById(chatId).exec();
    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    chat.messages.push({
      sender: userId,
      content: sendMessageDto.content,
      timestamp: new Date(),
    });

    await chat.save();
    return await this.chatModel
      .findById(chatId)
      .populate('participants', 'username')
      .populate('messages.sender', 'username')
      .exec();
  }
}
