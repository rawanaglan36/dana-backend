// message.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class ChildSkill {
  @Prop({ type: Types.ObjectId, ref: 'Child', required: true })
  childId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'SkillItem', required: true })
  itemId!: Types.ObjectId;

  @Prop({ default: false })
  checked!: boolean;
}

export const ChildSkillSchema = SchemaFactory.createForClass(ChildSkill);