/*
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
import { MarkReadDto } from './dto/markRead.dto';
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

*/

// chat/chat.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { SendSocketMessageDto } from './dto/send-socket-message.dto';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  // userId → socketId
  private onlineUsers = new Map<string, string>();

  constructor(private readonly chatService: ChatService) {}

  // ─── Lifecycle ────────────────────────────────

  handleConnection(client: Socket) {
    console.log(`Connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    // إزالة المستخدم من الـ Map
    for (const [userId, socketId] of this.onlineUsers.entries()) {
      if (socketId === client.id) {
        this.onlineUsers.delete(userId);
        break;
      }
    }
    console.log(this.onlineUsers);
    this.server.emit('getUsers', [...this.onlineUsers.keys()]);
  }


  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @MessageBody() payload: { userId: string; roomId: string },
    @ConnectedSocket() client: Socket,
  ) {
    this.onlineUsers.set(payload.userId, client.id);
    client.join(payload.roomId);   // ← Socket.io room
    console.log(this.onlineUsers);
    this.server.emit('getUsers', [...this.onlineUsers.keys()]);
    client.emit('joinedRoom', { roomId: payload.roomId });
    console.log(payload);
  }

  // 2) إرسال رسالة فورية + حفظ في DB
  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody() payload: SendSocketMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    // حفظ في DB
    const saved = await this.chatService.createMessage(payload);

    // إرسال لكل من في الـ room
    this.server.to(payload.roomId).emit('getMessage', {
      ...payload,
      _id: (saved as any)._id,
      createdAt: (saved as any).createdAt,
    });
    console.log(payload);
  }

  // 3) تأكيد الاستلام
  @SubscribeMessage('delivered')
  async handleDelivered(
    @MessageBody() payload: { messageId: string; roomId: string },
  ) {
    const updated = await this.chatService.markDelivered(payload.messageId);
    this.server.to(payload.roomId).emit('messageDelivered', {
      messageId: payload.messageId,
      deliveredAt: (updated as any).deliveredAt,
    });
    console.log(payload);
    console.log(this.onlineUsers);
  }
  
  // 4) تأكيد القراءة
  @SubscribeMessage('read')
  async handleRead(
    @MessageBody() payload: { messageId: string; roomId: string },
  ) {
    const updated = await this.chatService.markRead(payload.messageId);
    this.server.to(payload.roomId).emit('messageRead', {
      messageId: payload.messageId,
      readAt: (updated as any).readAt,
    });
  }
}