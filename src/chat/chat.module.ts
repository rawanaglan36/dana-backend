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
import { ChatController } from "./chat.controller";
import { Book, BookSchema } from "schemas/booking.schema";
import { ChatRepo, ChatRepoSchema } from "schemas/chatRepo.schema";

@Module({
    imports:[MongooseModule.forFeature([
        { name: ChatMessage.name, schema: ChatMessageSchema },
        { name: Parent.name, schema: ParentSchema },
        { name: Doctor.name, schema: DoctorSchema },
        { name: Book.name, schema: BookSchema },
        { name: ChatRepo.name, schema: ChatRepoSchema },
      ]),
      JwtModule.register({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '7d' },
      }),
    ParentModule],

    controllers: [RealtimeChatController,ChatController],

    providers:[ChatGateway, RealtimeChatService, ChatService, ChatPushService, AuthGuard],
})
export class ChatModule { }
