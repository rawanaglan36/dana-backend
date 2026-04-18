// notifications.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type NotificationDocument = Notification & Document;

@Schema({ timestamps: true })
export class Notification {
    @Prop({
        type: Types.ObjectId,
        ref: 'userModel',
        required: true
    })
    userId!: Types.ObjectId;


    @Prop({
        required: true,
        enum: ['Parent', 'Doctor']
    })
    userModel!: string;


    @Prop({ required: true })
    title!: string;

    @Prop({ required: true })
    body!: string;

    @Prop({
        required: true,
        enum: [
            'BOOKING',
            'MEDICATION',
            'REMINDER',
            'CHAT',
            'SYSTEM',
            'FAQ'
        ]
    })
    type!: NotificationType;

    @Prop({ default: false })
    isRead!: boolean;

    //MEDICATION TIME
    @Prop()
    scheduledAt?: Date;

    @Prop({
        enum: ['ONCE', 'DAILY', 'WEEKLY']
    })
    repeat?: string;

    //MEDICATION TIME


    //  interactive buttons
    @Prop({
        type: [{
            label: String,   // Yes / No
            action: String   // API endpoint or key
        }]
    })
    actions?: {
        label: string;
        action: string;
    }[];

    @Prop()
    response?: string;
    //  interactive buttons


    @Prop({ type: Object })
    data?: any;
}

export enum NotificationType {
    BOOKING = 'BOOKING',
    PAYMENT = 'PAYMENT',
    REMINDER = 'REMINDER',
    CHAT = 'CHAT',
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);