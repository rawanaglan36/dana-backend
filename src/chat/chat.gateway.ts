import { SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from '@nestjs/websockets';
import { UseGuards } from '@nestjs/common';
import { Server } from 'socket.io';
import { responseDto } from 'src/response.dto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { SocketJwtGuard } from './guard/socket-jwt.guard';
import { JoinRoomDto } from './dto/join-room.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { RealtimeChatService } from './realtime-chat.service';
import { JwtService } from '@nestjs/jwt';

// npm i @nestjs/websockets @nestjs/platform-socket.io
@WebSocketGateway({ cors: { origin: '*' } }) // allow all origins
export class ChatGateway {
  constructor(
    private readonly realtimeChatService: RealtimeChatService,
    private readonly jwtService: JwtService,
  ) {}

  @WebSocketServer()
  server: Server;

  async handleConnection(client: any) {
    const token = this.extractToken(client);
    if (!token) {
      client.disconnect();
      return;
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      client.data.user = payload;
    } catch {
      client.disconnect();
    }
  }

  @UseGuards(SocketJwtGuard)
  @SubscribeMessage('joinRoom')
  async handleJoinRoom(client: any, payload: JoinRoomDto) {
    const dto = await this.validateDto(JoinRoomDto, payload);
    const user = client?.data?.user;

    this.realtimeChatService.validateRoomAccess(user, dto.parentId, dto.doctorId);

    const roomId = this.realtimeChatService.buildRoomId(dto.parentId, dto.doctorId);
    client.join(roomId);

    client.emit('joinRoom', {
      response: new responseDto(200, 'success', { roomId }),
    });
  }

  @UseGuards(SocketJwtGuard)
  @SubscribeMessage('sendMessage')
  async handleSendMessage(client: any, payload: SendMessageDto) {
    const dto = await this.validateDto(SendMessageDto, payload);
    const user = client?.data?.user;

    const saved = await this.realtimeChatService.saveMessage(user, dto);

    this.server.to(saved.roomId).emit('receiveMessage', {
      response: new responseDto(200, 'success', saved),
    });
  }

  private async validateDto<T>(cls: new () => T, payload: any): Promise<T> {
    const dto = plainToInstance(cls, payload);
    const errors = await validate(dto as any, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });
    if (errors.length > 0) {
      throw new WsException('check your inputs');
    }
    return dto;
  }

  private extractToken(client: any): string | undefined {
    const authToken = client?.handshake?.auth?.token;
    if (typeof authToken === 'string' && authToken.trim()) {
      return authToken;
    }

    const headerAuth = client?.handshake?.headers?.authorization;
    if (typeof headerAuth === 'string' && headerAuth.trim()) {
      const [type, token] = headerAuth.split(' ');
      if (type === 'Bearer' && token) return token;
    }

    return undefined;
  }
}
