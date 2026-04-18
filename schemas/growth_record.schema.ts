import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type GrowthRecordDocument = GrowthRecord & Document;

@Schema({ timestamps: true })
export class GrowthRecord {
    @Prop({ type: Types.ObjectId, ref: 'Child', required: true })
    childId!: Types.ObjectId;

    @Prop({ required: true })
    height!: number;

    @Prop({ required: true })
    weight!: number;

    @Prop({ required: true })
    headCircumference!: number;

    @Prop({ required: true })
    recordDate!: Date;
}

export const GrowthRecordSchema = SchemaFactory.createForClass(GrowthRecord);