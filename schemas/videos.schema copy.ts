import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type VideosDocument = Video & Document;

@Schema({ timestamps: true })
export class Video {


  @Prop({ type: String, required: true })
  title!: string;

  @Prop({ type: String, default: '' })
  description?: string;

  @Prop({ type: String, default: '' })
  cover?: string;

  @Prop({ type: Number, default: 0 })
  views?: number;

  @Prop({ type: String, required: true })
  link!: string;

  @Prop({ required: true })
  time!: string;
}

export const VideoSchema = SchemaFactory.createForClass(Video);

VideoSchema.index({ title: 'text' });