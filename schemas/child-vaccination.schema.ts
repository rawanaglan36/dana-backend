import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ChildVaccinationDocument = ChildVaccination & Document;

@Schema({ timestamps: true })
export class ChildVaccination {
    @Prop({ type: Types.ObjectId, ref: 'Child', required: true })
    childId!: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Vaccine', required: true })
    vaccineId!: Types.ObjectId;

    @Prop({ required: true })
    dueDate!: Date;

    @Prop()
    takenDate?: Date;

    @Prop({
        enum: ['pending', 'taken', 'missed'],
        default: 'pending',
    })
    status!: string;

    @Prop()
    notes?: string;
}

export const ChildVaccinationSchema =
    SchemaFactory.createForClass(ChildVaccination);