import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Roles } from 'src/parent/decorator/Roles.decorator';
import { AuthGuard } from 'src/parent/guard/auth.guard';
import { SendChatDto } from './dto/send-chat.dto';
import { ChatService } from './chat.service';
import { randomUUID } from 'crypto';

@Controller('v1/chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Roles(['parent', 'admin', 'doctor'])
  @UseGuards(AuthGuard)
  @Post('send')
  async send(@Req() req, @Body() sendChatDto: SendChatDto) {
    const userId = req?.user?.sub || req?.user?._id;
    const conversationId = sendChatDto.conversationId || randomUUID();
    sendChatDto.conversationId = conversationId;
    return await this.chatService.sendMessage(userId, sendChatDto);
  }
}

