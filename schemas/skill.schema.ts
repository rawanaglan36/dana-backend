// message.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Skill {
    @Prop({ required: true })
    name!: string;
}

export const SkillSchema = SchemaFactory.createForClass(Skill);