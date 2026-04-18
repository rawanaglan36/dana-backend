import { OnModuleInit } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
//npm i @nestjs/websockets @nestjs/platform-socket.io
@WebSocketGateway({ cors: { origin: "*" } })//allow all origins
export class ChatGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  // @SubscribeMessage('message')
  // handleMessage(client: any, payload: any): string {
  //   return 'Hello world!';  
  // }
  handelConnection(client: any) {
    const userId = client.handshake.auth.userId;
    const userType = client.handshake.auth.userType;

    client.data.userId = userId;
    client.data.userType = userType;

    console.log(`Client connected: ${userType}-${userId}`);
  }

  //join room
  @SubscribeMessage('joinRoom')
  handelJoinRoom(client: any, payload: { parentID: string, doctorID: string }) {
    const room = payload.parentID + "-" + payload.doctorID;
    client.join(room);
    console.log(`Client joined room: ${room}`);
    client.emit('joinRoom', room,
      {
        parentID: payload.parentID,
        doctorID: payload.doctorID
      });
  }
  //send message
  @SubscribeMessage('sendMessage')
  handelSendMessage(client: any, payload: { parentID: string, doctorID: string, message: string }) {
    const room = payload.parentID + "-" + payload.doctorID;
    const senderId = client.data.userId;
    const senderType = client.data.userType;
    
    client.emit('newMessage', room, {
      senderId,
      senderType,
      message: payload.message,
      parentID: payload.parentID,
      doctorID: payload.doctorID,
      createdAt: new Date()
    });
  }
  // //leave room
  // leaveRoom(client: any, room: string) {
  //   client.leave(room);
  //   console.log(`Client left room: ${room}`);
  // }

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log('Client connected:', socket.id);
    });
  }
}
