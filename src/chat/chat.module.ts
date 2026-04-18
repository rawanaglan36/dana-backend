import { Module } from "@nestjs/common";
import { ChatGateway } from "./chat.gateway";

export const ChatModule=Module({
    providers:[ChatGateway]
    // exports:[ChatGateway]   
})