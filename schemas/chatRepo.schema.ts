
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ChatRepoDocument = HydratedDocument<ChatRepo>;

@Schema({ timestamps: true })
export class ChatRepo {
  @Prop({ type: Types.ObjectId, required: true })
  parentId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true })
  doctorId!: Types.ObjectId;

  @Prop({ type: String, required: true })
  roomId!: string;

  @Prop({ type: Types.ObjectId, required: false })
  senderId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: false })
  receiverId?: Types.ObjectId;

  @Prop({
    type: String,
    required: false,
    enum: ['Parent', 'Doctor'],
  })
  senderModel?: string;

 
  @Prop({
    type: String,
    enum: ['TEXT', 'IMAGE', 'DOCUMENT'],
    default: 'TEXT',
  })
  type?: string; 

  
  createdAt!: Date;
  updatedAt!: Date;
}

export const ChatRepoSchema = SchemaFactory.createForClass(ChatRepo);

