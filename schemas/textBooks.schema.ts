import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type TextBookDocument = TextBook & Document;

@Schema({ timestamps: true })
export class TextBook {


  @Prop({ type: String, required: true })
  title!: string;

  @Prop({ type: String })
  description!: string;

  @Prop({ type: String, required: true })
  author!: string;

  @Prop()
  cover?: string;

  @Prop({ type: String, required: true })
  link!: string;

}

export const TextBooksSchema = SchemaFactory.createForClass(TextBook);

TextBooksSchema.index({ title: 'text', author: 'text' });