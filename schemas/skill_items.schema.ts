// message.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
@Schema()
export class SkillItem {
    @Prop({ required: true })
    title!: string;

    @Prop({ type: Types.ObjectId, ref: 'Skill', required: true })
    skillId!: Types.ObjectId;
}

export const SkillItemSchema = SchemaFactory.createForClass(SkillItem);