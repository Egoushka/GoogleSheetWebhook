import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class EventsGateway {
  @WebSocketServer() server: Server;

  sendNewRowMessage(data: any) {
    this.server.emit('new-row', {
      type: 'new',
      content: data,
    });
  }

  sendUpdatedRowMessage(data: any) {
    this.server.emit('updated-row', {
      type: 'updated',
      content: data,
    });
  }
}
