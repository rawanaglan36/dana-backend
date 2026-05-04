import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { Roles } from 'src/parent/decorator/Roles.decorator';
import { AuthGuard } from 'src/parent/guard/auth.guard';
import { SendChatDto } from './dto/send-chat.dto';
import { ChatService } from './chat.service';
import { randomUUID } from 'crypto';
import { CreateMessageDto } from './dto/create-message.dto';
import { responseDto } from 'src/response.dto';

@Controller('v1/chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  //chat with ai
  @Roles(['parent', 'admin', 'doctor'])
  @UseGuards(AuthGuard)
  @Post('send')
  async send(@Req() req, @Body() sendChatDto: SendChatDto) {
    const userId = req?.user?.sub || req?.user?._id;
    const conversationId = sendChatDto.conversationId || randomUUID();
    sendChatDto.conversationId = conversationId;
    return await this.chatService.sendMessage(userId, sendChatDto);
  }

  //chat
  @Post('messages')
  async createMessage(@Body() dto: CreateMessageDto) {
    const data = await this.chatService.createMessage(dto);
    return { response: new responseDto(201, 'created successfully', data) };
  }
  @Post('conversations/:bookingId/parent')
  async createConversationByBookingIdParent(@Param('bookingId') bookingId: string) {
    return await this.chatService.createConversationByBookingIdParent(bookingId);
  }
  @Post('conversations/:bookingId/doctor')
  async createConversationByBookingIdDoctor(@Param('bookingId') bookingId: string) {
    return await this.chatService.createConversationByBookingIdDoctor(bookingId);
  }


  @Get('messages/room/:roomId')
  async getMessages(@Param('roomId') roomId: string) {
    return this.chatService.getMessagesByRoom(roomId);
  }


  @Get('messages/unread/:receiverId')
  async getUnread(@Param('receiverId') receiverId: string) {
    return await this.chatService.getUnreadMessages(receiverId);
  }

  // @Get('messages/room/:roomId/unread-count/:receiverId')
  // async unreadCount(
  //   @Param('roomId') roomId: string,
  //   @Param('receiverId') receiverId: string,
  // ) {
  //   return await this.chatService.getUnreadCount(roomId, receiverId);
  // }

  // mark delivered
  @Patch('messages/:id/delivered')
  async markDelivered(@Param('id') id: string) {
    return await this.chatService.markDelivered(id);
  }

  // mark read
  @Patch('messages/:id/read')
  async markRead(@Param('id') id: string) {
    return await this.chatService.markRead(id);
  }

  // @Roles(['parent', 'admin', 'doctor'])
  // @UseGuards(AuthGuard)
  @Get('check-room/:userId/room/:roomId')
  async validateRoomAccess(@Param('userId') userId: string,@Param('roomId') roomId: string) {
    return await this.chatService.validateRoomAccess(userId,roomId);
  } 
  
}

