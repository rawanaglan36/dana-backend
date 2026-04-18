import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type DoctorPatientRecordDocument = HydratedDocument<DoctorPatientRecord>;

@Schema({ timestamps: true })
export class DoctorPatientRecord {
  @Prop({ type: Types.ObjectId, ref: 'Doctor', required: true, index: true })
  doctorId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Child', required: true, index: true })
  patientId!: Types.ObjectId;

  @Prop({ type: String, required: true })
  patientName!: string;

  @Prop({ type: Types.ObjectId, ref: 'ChildRecord', required: false })
  childRecordId?: Types.ObjectId;

  @Prop({ type: Number, required: false })
  age?: number;

  @Prop({ type: Types.ObjectId, ref: 'Book', required: true })
  lastVisitBookingId!: Types.ObjectId;

  @Prop({ type: String, required: true })
  lastVisitDate!: string;

  @Prop({ type: String, required: true })
  lastVisitTime!: string;

  @Prop({ type: String, enum: ['canceled', 'pending', 'completed'], required: true })
  bookingStatus!: 'canceled' | 'pending' | 'completed';

  @Prop({ type: Boolean, required: false })
  isActive?: boolean;

  @Prop({ type: Boolean, required: false })
  needsAttention?: boolean;

  @Prop({ type: Boolean, required: false })
  activeThisWeek?: boolean;
}

export const DoctorPatientRecordSchema =
  SchemaFactory.createForClass(DoctorPatientRecord);

DoctorPatientRecordSchema.index({ doctorId: 1, patientId: 1 }, { unique: true });

