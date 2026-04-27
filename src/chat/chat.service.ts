import { BadRequestException, Injectable } from '@nestjs/common';
import axios from 'axios';
import { randomUUID } from 'crypto';
import { responseDto } from 'src/response.dto';
import { ParentService } from 'src/parent/parent.service';
import { SendChatDto } from './dto/send-chat.dto';

@Injectable()
export class ChatService {
  constructor(private readonly parentService: ParentService) {}

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
}

