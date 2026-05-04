import {
  BadRequestException,
  ForbiddenException,
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

  /** Same rules as [validateRoomAccess] but HTTP-friendly exceptions for REST. */
  validateRoomAccessHttp(payload: SocketJwtPayload, parentId: string, doctorId: string) {
    if (!payload?.sub || !payload?.role) {
      throw new UnauthorizedException();
    }

    if (!Types.ObjectId.isValid(parentId) || !Types.ObjectId.isValid(doctorId)) {
      throw new BadRequestException('invalid input');
    }

    const role = payload.role.toLowerCase();
    if (role === 'parent' && payload.sub !== parentId) {
      throw new ForbiddenException('Unauthorized');
    }
    if (role === 'doctor' && payload.sub !== doctorId) {
      throw new ForbiddenException('Unauthorized');
    }
    if (role !== 'parent' && role !== 'doctor') {
      throw new ForbiddenException('Unauthorized');
    }
  }

  async listMessages(
    payload: SocketJwtPayload,
    params: {
      parentId: string;
      doctorId: string;
      limit?: number;
      before?: string;
    },
  ) {
    const { parentId, doctorId, before } = params;
    this.validateRoomAccessHttp(payload, parentId, doctorId);

    const roomId = this.buildRoomId(parentId, doctorId);
    const limitRaw = params.limit ?? 50;
    const limit = Math.min(
      200,
      Math.max(1, Number.isFinite(Number(limitRaw)) ? Math.floor(Number(limitRaw)) : 50),
    );

    const filter: Record<string, unknown> = { roomId };
    if (before) {
      const d = new Date(before);
      if (!Number.isNaN(d.getTime())) {
        filter.createdAt = { $lt: d };
      }
    }

    const rows = await this.chatMessageModel
      .find(filter as any)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean()
      .exec();

    const chronological = [...rows].reverse();

    const messages = chronological.map((doc: any) => ({
      _id: String(doc._id),
      roomId: doc.roomId as string,
      parentId: String(doc.parentId),
      doctorId: String(doc.doctorId),
      senderId: String(doc.senderId),
      receiverId: String(doc.receiverId),
      message: doc.message as string,
      clientMessageId: doc.clientMessageId as string | undefined,
      createdAt:
        doc.createdAt instanceof Date
          ? doc.createdAt.toISOString()
          : String(doc.createdAt ?? ''),
      deliveredAt: doc.deliveredAt
        ? doc.deliveredAt instanceof Date
          ? doc.deliveredAt.toISOString()
          : String(doc.deliveredAt)
        : undefined,
      readAt: doc.readAt
        ? doc.readAt instanceof Date
          ? doc.readAt.toISOString()
          : String(doc.readAt)
        : undefined,
    }));

    const oldest = chronological[0] as any;
    const nextBefore =
      oldest?.createdAt instanceof Date
        ? oldest.createdAt.toISOString()
        : oldest?.createdAt
          ? String(oldest.createdAt)
          : null;

    return { messages, nextBefore: chronological.length >= limit ? nextBefore : null };
  }

  async markDelivered(
    payload: SocketJwtPayload,
    dto: { parentId: string; doctorId: string; messageIds: string[] },
  ) {
    this.validateRoomAccess(payload, dto.parentId, dto.doctorId);
    const roomId = this.buildRoomId(dto.parentId, dto.doctorId);
    const receiverOid = new Types.ObjectId(payload.sub!);
    const ids = dto.messageIds
      .filter((id) => Types.ObjectId.isValid(id))
      .map((id) => new Types.ObjectId(id));
    if (!ids.length) {
      return { messageIds: [] as string[], deliveredAt: new Date().toISOString() };
    }
    const now = new Date();
    await this.chatMessageModel.updateMany(
      {
        _id: { $in: ids },
        roomId,
        receiverId: receiverOid,
        $or: [{ deliveredAt: { $exists: false } }, { deliveredAt: null }],
      },
      { $set: { deliveredAt: now } },
    );
    const updated = await this.chatMessageModel
      .find({
        _id: { $in: ids },
        roomId,
        receiverId: receiverOid,
        deliveredAt: { $ne: null },
      })
      .select('_id')
      .lean();
    return {
      messageIds: updated.map((d: any) => String(d._id)),
      deliveredAt: now.toISOString(),
    };
  }

  async markRead(
    payload: SocketJwtPayload,
    dto: { parentId: string; doctorId: string; messageIds?: string[]; readAll?: boolean },
  ) {
    this.validateRoomAccess(payload, dto.parentId, dto.doctorId);
    const roomId = this.buildRoomId(dto.parentId, dto.doctorId);
    const receiverOid = new Types.ObjectId(payload.sub!);
    const now = new Date();
    const filter: Record<string, unknown> = {
      roomId,
      receiverId: receiverOid,
      $or: [{ readAt: { $exists: false } }, { readAt: null }],
    };

    if (dto.readAll) {
      await this.chatMessageModel.updateMany(filter, { $set: { readAt: now } });
      const since = new Date(now.getTime() - 3000);
      const updated = await this.chatMessageModel
        .find({
          roomId,
          receiverId: receiverOid,
          readAt: { $gte: since },
        })
        .select('_id')
        .lean();
      return {
        messageIds: updated.map((d: any) => String(d._id)),
        readAt: now.toISOString(),
      };
    }

    const ids =
      dto.messageIds
        ?.filter((id) => Types.ObjectId.isValid(id))
        .map((id) => new Types.ObjectId(id)) ?? [];
    if (!ids.length) {
      return { messageIds: [] as string[], readAt: now.toISOString() };
    }
    await this.chatMessageModel.updateMany(
      { ...filter, _id: { $in: ids } },
      { $set: { readAt: now } },
    );
    const updated = await this.chatMessageModel
      .find({
        _id: { $in: ids },
        roomId,
        receiverId: receiverOid,
        readAt: { $ne: null },
      })
      .select('_id')
      .lean();
    return {
      messageIds: updated.map((d: any) => String(d._id)),
      readAt: now.toISOString(),
    };
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

