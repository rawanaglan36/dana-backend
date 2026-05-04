/** */
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import axios from 'axios';
import { randomUUID } from 'crypto';
import { responseDto } from './response.dto';
import { ParentService } from 'src/parent/parent.service';
import { SendChatDto } from './dto/send-chat.dto';
import { Model, Types } from 'mongoose';
import { ChatMessage, ChatMessageDocument } from 'schemas/chatMessage.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CreateMessageDto } from './dto/create-message.dto';
import { Book } from 'schemas/booking.schema';
import { ChatRepo, ChatRepoDocument } from 'schemas/chatRepo.schema';

@Injectable()
export class ChatService {
  constructor(private readonly parentService: ParentService,
    @InjectModel(ChatMessage.name)
    private chatMessageModel: Model<ChatMessageDocument>,
    @InjectModel(Book.name) private bookModel: Model<Book>,
    @InjectModel(ChatRepo.name) private chatRepoModel: Model<ChatRepoDocument>, 
    // ,
    // @InjectModel(ChatMessage.name)
    // private chatMessageModel: Model<ChatMessage>,
  ) { }

  async sendMessage(userId: string, sendChatDto: SendChatDto) {
    if (!userId) {
      throw new BadRequestException('invalid input');
    }

    if (!sendChatDto.conversationId) {
      sendChatDto.conversationId = randomUUID();
    }

    const isNewConversation = true;

    if (isNewConversation && process.env.SAVE_CHAT_CONVERSATION_ID === 'true') {
      await this.parentService.saveChatConversationId(userId, sendChatDto.conversationId);
    }

    const aiServiceUrl = process.env.AI_SERVICE_URL;
    if (!aiServiceUrl) {
      throw new BadRequestException('UNKNOWN');
    }

    const base = aiServiceUrl.endsWith('/') ? aiServiceUrl : `${aiServiceUrl}/`;
    const res = await axios.post(
      `${base}api/chat`,
      {
        conversation_id: sendChatDto.conversationId,
        message: sendChatDto.message,
      },
      {
        headers: {
          'X-User-ID': userId,
        },
      },
    );
    return {
      response: new responseDto(200, 'success', {
        conversationId: sendChatDto.conversationId,
        aiResponse: res.data,
      }),
    };
  }
  async createMessage(dto: CreateMessageDto): Promise<ChatMessage> {
    const message = new this.chatMessageModel({
      ...dto,
      parentId: new Types.ObjectId(dto.parentId),
      doctorId: new Types.ObjectId(dto.doctorId),
      senderId: new Types.ObjectId(dto.senderId),
      receiverId: new Types.ObjectId(dto.receiverId),
    });
    return message.save();
  }

  async getMessagesByRoom(roomId: string) {
    if (!roomId) throw new BadRequestException('roomId is required');
    const messages= await this.chatMessageModel
      .find({ roomId })
      .sort({ createdAt: 1 })
      .exec();
      return {response:new responseDto(200,'success',messages)};

  }

  // ─── جلب رسائل غير مقروءة لمستخدم ───────────
  async getUnreadMessages(receiverId: string): Promise<ChatMessage[]> {
    if (!Types.ObjectId.isValid(receiverId)) {
      throw new BadRequestException('Invalid receiverId');
    }
    return this.chatMessageModel.find({
      receiverId: new Types.ObjectId(receiverId),
      readAt: null,
    });
  }

  // ─── تأكيد استلام الرسالة ─────────────────────
  async markDelivered(messageId: string): Promise<ChatMessage> {
    if (!Types.ObjectId.isValid(messageId)) {
      throw new BadRequestException('Invalid messageId');
    }
    const msg = await this.chatMessageModel.findByIdAndUpdate(
      messageId,
      { deliveredAt: new Date() },
      { new: true },
    );
    if (!msg) throw new NotFoundException('Message not found');
    return msg;
  }

  // ─── تأكيد قراءة الرسالة ──────────────────────
  async markRead(messageId: string): Promise<ChatMessage> {
    if (!Types.ObjectId.isValid(messageId)) {
      throw new BadRequestException('Invalid messageId');
    }
    const msg = await this.chatMessageModel.findByIdAndUpdate(
      messageId,
      { readAt: new Date() },
      { new: true },
    );
    if (!msg) throw new NotFoundException('Message not found');
    return msg;
  }

  // ─── عدد الرسائل غير المقروءة في room ────────
  async getUnreadCount(roomId: string, receiverId: string): Promise<number> {
    return this.chatMessageModel.countDocuments({
      roomId,
      receiverId: new Types.ObjectId(receiverId),
      readAt: null,
    });
  }

  async createConversationByBookingIdParent(bookingId: string) {
    const booking = await this.bookModel.findById(bookingId);
    if (!booking) throw new NotFoundException('Booking not found');

    const data = {
      parentId: booking.parentId,
      doctorId: booking.doctorId,
      roomId: booking.parentId.toString() + '_' + booking.doctorId.toString(),
      senderId: booking.parentId,
      receiverId: booking.doctorId,
      senderModel: 'Parent',
      
      // message: ' welcome to the chat',
      type: 'TEXT',
    };
    await this.chatRepoModel.create(data);
    
    return { response: new responseDto(200, 'success', data) };

  }
  async createConversationByBookingIdDoctor(bookingId: string) {
    const booking = await this.bookModel.findById(bookingId);
    if (!booking) throw new NotFoundException('Booking not found');

    const data = {
      doctorId: booking.doctorId,
      parentId: booking.parentId,
      roomId: booking.parentId.toString() + '_' + booking.doctorId.toString(),
      senderId: booking.doctorId,
      receiverId: booking.parentId,
      senderModel: 'Doctor',
      // message: ' welcome to the chat',
      type: 'TEXT',
    };
    await this.chatRepoModel.create(data);
    
    return { response: new responseDto(200, 'success', data) };
  }

  async validateRoomAccess(userId: string, roomId: string) {
    
    const room = await this.chatRepoModel.findOne({ roomId });

    if (!room) throw new Error('Room not found');

    if (room.parentId.toString() !== userId && room.doctorId.toString() !== userId) {
      throw new Error('Not allowed');
    }

    const booking = await this.bookModel.findOne({ parentId: room.parentId, doctorId: room.doctorId });
    if (!booking) throw new NotFoundException('Booking not found');

    // if(booking.status === 'cancelled'){
    //   throw new BadRequestException('Booking is canceled');
    // }
    return true;
  }
}
