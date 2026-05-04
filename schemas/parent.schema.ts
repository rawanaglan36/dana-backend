import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ParentDocument = HydratedDocument<Parent>;

@Schema({ timestamps: true })
export class Parent {
    @Prop({
        type: String,
        required: true,
        min: [3, 'name must be at least 3 character'],
        max: [30, 'name must be at  most 30 character']
    })
    parentName!: string;

    @Prop({
        type: Number,
    })
    age?: number;

    @Prop({
        type: String,
        required: true,
        unique: true,
        // index: true,
    })
    email!: string;

    @Prop({
        type: String,
        required: true,

    })
    phone!: string;

    @Prop({
        type: String,
        default:'parent',
    })
    role?: string;

    @Prop({
        type: Number,
    })
    verficationCode?: number;

    @Prop({
        type: Boolean,
        default: false,
    })
    isVerified!: boolean;

    @Prop({
        type: Boolean,
        default: true,
    })
    isActive!: boolean;

    @Prop({
        type: String,
        // required: true,

    })
    government?: string;

    @Prop({
        type: String,
        // required: true,

    })
    address?: string;

    @Prop({
        type: String,
        required: false,
        min: [3, 'password must be at least 3 characters'],
        max: [20, "password must be at most 30 characters"],
        select: false,
        default:null
    })
    password?: string;

    @Prop({
        type: String,
    })
    provider?: string;

    @Prop({
        type: String,
    })
    providerId?: string;

    @Prop({
        type: [{ type: Types.ObjectId, ref: 'Child' }],
        required: true
    })
    children!: Types.ObjectId[];

    @Prop({
        type: [{ type: Types.ObjectId, ref: 'booking' }],
    })
    bookings?: Types.ObjectId[];

    
    @Prop({ nullable: true ,default:null})
    profileImage!: string;

    @Prop({ nullable: true ,default:null})
    profileImagePublicId!: string;

    @Prop({
        type: [String],
        default: [],
        required: false,
    })
    chatConversationIds?: string[];

    @Prop({ type: [String], default: [] })
    fcmTokens?: string[];

    @Prop({ type: Boolean, default: true })
    messageNotification?: boolean;
}

export const ParentSchema = SchemaFactory.createForClass(Parent);
