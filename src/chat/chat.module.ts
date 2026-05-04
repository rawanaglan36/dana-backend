import { Module } from "@nestjs/common";
import { ChatGateway } from "./chat.gateway";
import { MongooseModule } from "@nestjs/mongoose";
import { ChatMessage, ChatMessageSchema } from "schemas/chatMessage.schema";
import { Parent, ParentSchema } from "schemas/parent.schema";
import { Doctor, DoctorSchema } from "schemas/doctor.schema";
import { RealtimeChatService } from "./realtime-chat.service";
import { ChatService } from "./chat.service";
import { ParentModule } from "src/parent/parent.module";
import { JwtModule } from "@nestjs/jwt";
import { RealtimeChatController } from "./realtime-chat.controller";
import { AuthGuard } from "src/parent/guard/auth.guard";
import { ChatPushService } from "./chat-push.service";

@Module({
    imports:[MongooseModule.forFeature([
        { name: ChatMessage.name, schema: ChatMessageSchema },
        { name: Parent.name, schema: ParentSchema },
        { name: Doctor.name, schema: DoctorSchema },
      ]),
      JwtModule.register({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '7d' },
      }),
    ParentModule],

    controllers: [RealtimeChatController],

    providers:[ChatGateway, RealtimeChatService, ChatService, ChatPushService, AuthGuard],
})
export class ChatModule { }
