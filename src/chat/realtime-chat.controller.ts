import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { Roles } from 'src/parent/decorator/Roles.decorator';
import { AuthGuard } from 'src/parent/guard/auth.guard';
import { responseDto } from 'src/response.dto';
import { ListRealtimeMessagesQueryDto } from './dto/list-realtime-messages.query.dto';
import { RegisterFcmTokenDto } from './dto/register-fcm-token.dto';
import { RealtimeChatService, SocketJwtPayload } from './realtime-chat.service';
import { ChatPushService } from './chat-push.service';

@Controller('v1/realtime-chat')
export class RealtimeChatController {
  constructor(
    private readonly realtimeChatService: RealtimeChatService,
    private readonly chatPushService: ChatPushService,
  ) {}

  @Roles(['parent', 'doctor'])
  @UseGuards(AuthGuard)
  @Get('messages')
  async listMessages(
    @Req() req: { user?: { sub?: string; role?: string } },
    @Query() query: ListRealtimeMessagesQueryDto,
  ) {
    const u = req.user;
    const payload: SocketJwtPayload = {
      sub: typeof u?.sub === 'string' ? u.sub : undefined,
      role: typeof u?.role === 'string' ? u.role : undefined,
    };

    const { messages, nextBefore } = await this.realtimeChatService.listMessages(payload, {
      parentId: query.parentId,
      doctorId: query.doctorId,
      limit: query.limit,
      before: query.before,
    });

    return {
      response: new responseDto(200, 'success', { messages, nextBefore }),
    };
  }

  @Roles(['parent', 'doctor'])
  @UseGuards(AuthGuard)
  @Post('device-token')
  async registerDeviceToken(
    @Req() req: { user?: { sub?: string; role?: string } },
    @Body() body: RegisterFcmTokenDto,
  ) {
    const u = req.user;
    await this.chatPushService.registerToken(String(u?.sub), String(u?.role), body.token);
    return {
      response: new responseDto(200, 'success', { ok: true }),
    };
  }
}
