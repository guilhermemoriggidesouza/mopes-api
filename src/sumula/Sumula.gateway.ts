import { SumulaService } from './Sumula.service';
import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsResponse,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class SumulaGateway {
    constructor(
        private readonly sumulaService: SumulaService,
    ) { }

    @WebSocketServer()
    server: Server;

    @SubscribeMessage('refresh')
    async findAll(@MessageBody() data: any): Promise<void> {
        const gameStatus = await this.sumulaService.getGameStatus({ id: data.sumulaId })
        this.server.emit("refresh", gameStatus)
    }
}