import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ChatMessage } from 'schemas/chatMessage.schema';
import { SendMessageDto } from './dto/send-message.dto';
import { WsException } from '@nestjs/websockets';

export type SocketJwtPayload = {
  sub?: string;
  phone?: string;
  role?: string;
};

@Injectable()
export class RealtimeChatService {
  constructor(
    @InjectModel(ChatMessage.name)
    private readonly chatMessageModel: Model<ChatMessage>,
  ) {}

  buildRoomId(parentId: string, doctorId: string) {
    return `${parentId}_${doctorId}`;
  }

  validateRoomAccess(payload: SocketJwtPayload, parentId: string, doctorId: string) {
    if (!payload?.sub || !payload?.role) {
      throw new UnauthorizedException();
    }

    if (!Types.ObjectId.isValid(parentId) || !Types.ObjectId.isValid(doctorId)) {
      throw new BadRequestException('invalid input');
    }

    const role = payload.role.toLowerCase();
    if (role === 'parent' && payload.sub !== parentId) throw new WsException('Unauthorized');
    if (role === 'doctor' && payload.sub !== doctorId) throw new WsException('Unauthorized');
    if (role !== 'parent' && role !== 'doctor')        throw new WsException('Unauthorized');
  }

  async saveMessage(payload: SocketJwtPayload, dto: SendMessageDto) {
    this.validateRoomAccess(payload, dto.parentId, dto.doctorId);

    const senderId = payload.sub!;
    const role = payload.role!.toLowerCase();
    const receiverId = role === 'parent' ? dto.doctorId : dto.parentId;

    const roomId = this.buildRoomId(dto.parentId, dto.doctorId);

    const created = await this.chatMessageModel.create({
      parentId: new Types.ObjectId(dto.parentId),
      doctorId: new Types.ObjectId(dto.doctorId),
      roomId,
      senderId: new Types.ObjectId(senderId),
      receiverId: new Types.ObjectId(receiverId),
      message: dto.message,
      clientMessageId: dto.clientMessageId,
    });

    return {
      _id: created._id,
      roomId: created.roomId,
      parentId: dto.parentId,
      doctorId: dto.doctorId,
      senderId,
      receiverId,
      message: created.message,
      clientMessageId: created.clientMessageId,
      createdAt: created.createdAt,
    };
  }
}

