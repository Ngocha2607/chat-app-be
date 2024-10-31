import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { Types } from 'mongoose';
import { SendMessageDto } from './dto/send-message.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
  transports: ['websocket', 'polling'],
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  constructor(private readonly chatService: ChatService) {}

  afterInit(server: Server) {
    console.log('ChatGateway initialized');
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    client: Socket,
    payload: { chatId: string; userId: Types.ObjectId; content: string },
  ) {
    const message: SendMessageDto = { content: payload.content };
    const chat = await this.chatService.sendMessage(
      payload.chatId,
      payload.userId,
      message,
    );
    this.server.to(payload.chatId).emit('receiveMessage', chat);
  }

  @SubscribeMessage('joinChat')
  handleJoinChat(client: Socket, chatId: string) {
    client.join(chatId);
    console.log(`Client ${client.id} joined chat ${chatId}`);
  }
}
