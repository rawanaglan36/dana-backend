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

  /** When the receiver client acknowledged delivery (optional). */
  @Prop({ type: Date, required: false })
  deliveredAt?: Date;

  /** When the receiver marked the message as read (optional). */
  @Prop({ type: Date, required: false })
  readAt?: Date;

  createdAt!: Date;
  updatedAt!: Date;
}

export const ChatMessageSchema = SchemaFactory.createForClass(ChatMessage);

