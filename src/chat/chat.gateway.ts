import { SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from '@nestjs/websockets';
import { UseGuards } from '@nestjs/common';
import { Server } from 'socket.io';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { responseDto } from './response.dto';
import { extractJwtFromSocketHandshake } from './utils/extract-socket-jwt';
import { SocketJwtGuard } from './guard/socket-jwt.guard';
import { JoinRoomDto } from './dto/join-room.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { RealtimeChatService } from './realtime-chat.service';
import { JwtService } from '@nestjs/jwt';
import { ChatTypingDto } from './dto/chat-typing.dto';
import { MarkDeliveredDto } from './dto/mark-delivered.dto';
import { MarkReadDto } from './dto/mark-read.dto';
import { ChatPushService } from './chat-push.service';

// npm i @nestjs/websockets @nestjs/platform-socket.io
@WebSocketGateway({ 
  cors: { origin: '*' },
  path: '/socket.io/',      
  transports: ['websocket', 'polling'],
}) // allow all origins
export class ChatGateway {
  constructor(
    private readonly realtimeChatService: RealtimeChatService,
    private readonly jwtService: JwtService,
    private readonly chatPushService: ChatPushService,
  ) {}

  @WebSocketServer()
  server: Server;

  async handleConnection(client: any) {
    const token = extractJwtFromSocketHandshake(client);
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

    const role = String(user?.role ?? '').toLowerCase();
    const recvRole: 'parent' | 'doctor' = role === 'parent' ? 'doctor' : 'parent';
    const recvId = recvRole === 'doctor' ? dto.doctorId : dto.parentId;
    void this.chatPushService.notifyNewChatMessage({
      preview: dto.message,
      receiverId: recvId,
      receiverRole: recvRole,
      data: {
        type: 'chat_message',
        parentId: dto.parentId,
        doctorId: dto.doctorId,
        roomId: saved.roomId,
        messageId: String(saved._id),
      },
    });
  }

  @UseGuards(SocketJwtGuard)
  @SubscribeMessage('typing')
  async handleTyping(client: any, payload: unknown) {
    const dto = await this.validateDto(ChatTypingDto, payload);
    const user = client?.data?.user;
    this.realtimeChatService.validateRoomAccess(user, dto.parentId, dto.doctorId);
    const roomId = this.realtimeChatService.buildRoomId(dto.parentId, dto.doctorId);
    client.broadcast.to(roomId).emit('peerTyping', {
      response: new responseDto(200, 'success', {
        isTyping: dto.isTyping,
        senderId: user.sub,
        parentId: dto.parentId,
        doctorId: dto.doctorId,
      }),
    });
  }

  @UseGuards(SocketJwtGuard)
  @SubscribeMessage('markDelivered')
  async handleMarkDelivered(client: any, payload: unknown) {
    const dto = await this.validateDto(MarkDeliveredDto, payload);
    const user = client?.data?.user;
    const roomId = this.realtimeChatService.buildRoomId(dto.parentId, dto.doctorId);
    const result = await this.realtimeChatService.markDelivered(user, dto);
    this.server.to(roomId).emit('receiptUpdate', {
      response: new responseDto(200, 'success', {
        kind: 'delivered',
        ...result,
      }),
    });
  }

  @UseGuards(SocketJwtGuard)
  @SubscribeMessage('markRead')
  async handleMarkRead(client: any, payload: unknown) {
    const dto = await this.validateDto(MarkReadDto, payload);
    const user = client?.data?.user;
    const roomId = this.realtimeChatService.buildRoomId(dto.parentId, dto.doctorId);
    const result = await this.realtimeChatService.markRead(user, {
      parentId: dto.parentId,
      doctorId: dto.doctorId,
      messageIds: dto.messageIds,
      readAll: dto.readAll,
    });
    this.server.to(roomId).emit('receiptUpdate', {
      response: new responseDto(200, 'success', {
        kind: 'read',
        ...result,
      }),
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
}
