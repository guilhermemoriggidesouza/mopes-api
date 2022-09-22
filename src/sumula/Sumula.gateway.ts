import { SumulaService } from './Sumula.service';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: true })
export class SumulaGateway {
  constructor(private readonly sumulaService: SumulaService) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('refresh')
  async findAll(@MessageBody() data: any): Promise<void> {
    const gameStatus = await this.sumulaService.getGameStatus({
      id: data.sumulaId,
    });
    this.server.emit(`sync:${data.sumulaId}`, gameStatus);
  }
}
