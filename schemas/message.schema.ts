// message.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MessageDocument = Message & Document;

@Schema({ timestamps: true })
export class Message {

    @Prop()
    bookingId?: string;

    // sender
    @Prop({
        type: Types.ObjectId,
        required: true,
        refPath: 'senderModel'
    })
    senderId!: Types.ObjectId;

    @Prop({
        required: true,
        enum: ['Parent', 'Doctor']
    })
    senderModel!: string;

    // receiver
    @Prop({
        type: Types.ObjectId,
        required: true,
        refPath: 'receiverModel'
    })
    receiverId!: Types.ObjectId;

    @Prop({
        required: true,
        enum: ['Parent', 'Doctor']
    })
    receiverModel!: string;

    @Prop({ required: true })
    message!: string;

    @Prop({ enum: ['TEXT', 'IMAGE','DOCUMENT'], default: 'TEXT' })
    type!: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);