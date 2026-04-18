import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ChildDocument = HydratedDocument<Child>;

@Schema({ timestamps: true })
export class Child {
    @Prop({
        type: String,
        required: true,
        min: [3, 'name must be at least 3 character'],
        max: [30, 'name must be at  most 30 character']
    })
    childName!: string;

    @Prop({
        type: Number,
    })
    age?: number;


    @Prop({
        type: String,
        enum: ['male', 'female']
    })
    gender!: string;

    @Prop({
        type: String,
        default: 'child',
    })
    role?: string;

    @Prop({
        type: Date,
        required: true
    })
    birthDate!: Date;

    @Prop({
        type: Boolean,
        default: true,
    })
    isActive!: boolean;

    @Prop({
        type: Types.ObjectId,
        ref: 'Parent',
        required: true
    })
    parentId!: Types.ObjectId;

    @Prop({
        type: [{ type: Types.ObjectId, ref: 'booking' }],
    })
    bookings?: Types.ObjectId[];

    @Prop()
    currentHeight?: number;

    @Prop()
    currentWeight?: number;

    @Prop()
    currentHeadCircumference?: number;

    @Prop({ nullable: true, default: null })
    profileImage?: string;

    @Prop({ nullable: true, default: null })
    profileImagePublicId?: string;
}

export const ChildSchema = SchemaFactory.createForClass(Child);



