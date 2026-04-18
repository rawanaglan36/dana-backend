// sensory-question.schema.ts

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type SensoryQuestionDocument = SensoryQuestion & Document;


@Schema()
export class SensoryQuestion {
    @Prop({ required: true })
    text!: string;

    @Prop({ required: true })
    category!: 'seeking' | 'avoiding' | 'sensitivity' | 'registration';

    @Prop({
        type: [
            {
                label: String,
                value: Number,
            },
        ],
    })
    options!: {
        label: string;
        value: number;
    }[];
}

export const SensoryQusetionSchema = SchemaFactory.createForClass(SensoryQuestion);
