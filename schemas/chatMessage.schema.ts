import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ChatMessageDocument = HydratedDocument<ChatMessage>;

@Schema({ timestamps: true })
export class ChatMessage {
  @Prop({ type: Types.ObjectId, required: true })
  parentId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true })
  doctorId!: Types.ObjectId;

  @Prop({ type: String, required: true })
  roomId!: string;

  @Prop({ type: Types.ObjectId, required: true })
  senderId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true })
  receiverId!: Types.ObjectId;

  @Prop({ type: String, required: true })
  message!: string;

  @Prop({ type: String, required: false })
  clientMessageId?: string;

  createdAt!: Date;
  updatedAt!: Date;
}

export const ChatMessageSchema = SchemaFactory.createForClass(ChatMessage);

