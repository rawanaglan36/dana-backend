import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type BookingDocument = HydratedDocument<Book>;

@Schema({ timestamps: true })
export class Book {
  @Prop({
    type: Types.ObjectId,
    ref: 'Parent',
    required: true
  })
  parentId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Child',
    required: true
  })
  childId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Doctor',
    required: true
  })
  doctorId: Types.ObjectId;



  @Prop({
    type: String,
    required: true
  })
  date: string;

  @Prop({
    type: String,
    required: true
  })
  time: string;

  @Prop({
    type: String,
    required: true,
    enum: ['examination', 'follow-up']
  })
  visitStatus: string;



  //payment
  
  @Prop({
      type: Number,
      required: true
    })
    detectionPrice: number;
    @Prop({ type: String, default: 'EGP' })
    currency: string;
    
    @Prop({ type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' })
    status: 'pending' | 'confirmed' | 'cancelled';
    
    @Prop({ type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' })
    paymentStatus: 'pending' | 'paid' | 'failed';
    
    
    @Prop({ type: String, default: 'paymob' })
    paymentProvider: string;
    
    @Prop({ type: String, required: false })
    paymobOrderId?: string;
    
    @Prop({ type: String, required: false })
    paymobTransactionId?: string;
    
    @Prop({
      type: String,
      required: true,
      enum: ['on-visit', 'visa'],
      default:'on-visit'
    })
    paymentMethod: string;
    
    
    //payment




  @Prop({ type: String, })
  notes: string;

  @Prop({ type: Number, min: 1, max: 5 })
  rating?: number;
}

export const BookSchema = SchemaFactory.createForClass(Book);

// BookSchema.index({doctorId:1,date:1,time:1},{unique:true});