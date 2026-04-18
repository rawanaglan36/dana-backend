import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type VaccineDocument = Vaccine & Document;

@Schema()
export class Vaccine {
    @Prop({ required: true })
    name!: string;

    @Prop()
    description!: string;

    @Prop({ required: true })
    scheduleValue!: number; // 40

    @Prop({
        enum: ['hours', 'days', 'weeks', 'months'],
        required: true,
    })
    scheduleUnit!: string; // days


    @Prop({ default: true })
    isMandatory!: boolean;
}

export const VaccineSchema = SchemaFactory.createForClass(Vaccine);