// sensory-test.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SensoryTestDocument = SensoryTest & Document;

@Schema({ timestamps: true })
export class SensoryTest {
    @Prop({ type: Types.ObjectId, ref: 'Child', required: true })
    childId!: Types.ObjectId;

    @Prop({
        type: [
            {
                questionId: { type: String, required: true },
                selectedValue: { type: Number, required: true },
            },
        ],
    })
    answers!: {
        questionId: string;
        selectedValue: number;
    }[];

    @Prop()
    totalScore!: number;

    @Prop()
    level!: string;

    @Prop({
        type: {
            seeking: Number,
            avoiding: Number,
            sensitivity: Number,
            registration: Number,
        },
    })
    categoryScores?: {
        seeking: number;
        avoiding: number;
        sensitivity: number;
        registration: number;
    };
}

export const SensoryTestSchema = SchemaFactory.createForClass(SensoryTest);