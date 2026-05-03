import { Module } from "@nestjs/common";
import { ChatGateway } from "./chat.gateway";
import { MongooseModule } from "@nestjs/mongoose";
import { ChatMessage, ChatMessageSchema } from "schemas/chatMessage.schema";
import { RealtimeChatService } from "./realtime-chat.service";
import { ChatService } from "./chat.service";
import { ParentService } from "src/parent/parent.service";
import { ParentModule } from "src/parent/parent.module";
import { JwtModule } from "@nestjs/jwt";

@Module({
    imports:[MongooseModule.forFeature([
        { name: ChatMessage.name, schema: ChatMessageSchema },
      ]),
      JwtModule.register({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '7d' },
      }),
    ParentModule],
       
    providers:[ChatGateway,RealtimeChatService,ChatService],


    // exports:[ChatGateway]   
})
export class ChatModule { }
