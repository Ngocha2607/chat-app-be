import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway()
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  constructor(private readonly chatService: ChatService) {}

  afterInit(server: Server) {
    console.log('ChatGateway initialized');
  }

  handleConnection(client: any, ...args: any[]) {
    console.log('Client connected');
  }
}
