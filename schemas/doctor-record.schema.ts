import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type DoctorRecordDocument = HydratedDocument<DoctorRecord>;

@Schema({ timestamps: true })
export class DoctorRecord {
  @Prop({ type: Types.ObjectId, ref: 'Doctor', required: true, index: true })
  doctorId!: Types.ObjectId;

  @Prop({ type: Date, required: true, index: true })
  recordDate!: Date;

  @Prop({ type: Number, required: true, default: 0 })
  todaysAppointmentsCount!: number;

  // @Prop({ type: [Types.ObjectId], ref: 'Book', default: [] })
  // todaysAppointments!: Types.ObjectId[];

  @Prop({
    type: {
      completed: { type: Number, default: 0 },
      cancelled: { type: Number, default: 0 },
      pending: { type: Number, default: 0 },
    },
    default: {},
  })
  appointmentStatusCount!: {
    completed: number;
    cancelled: number;
    pending: number;
  };

  @Prop({
    type: {
      visa: { type: Number, default: 0 },
      cash: { type: Number, default: 0 },
    },
    default: {},
  })
  paymentMethodCount!: {
    visa: number;
    cash: number;
  };

  /** Count of all patients (children) with isActive: true for this doctor (snapshot at generate time). */
  @Prop({ type: Number, required: false })
  totalActivePatients?: number;

  /** Bookings for this doctor in the calendar month of recordDate. */
  @Prop({ type: Number, required: false })
  monthlyPerformance?: number;

  /** Bookings for this doctor in recordDate's year, one entry per month (1–12). */
  @Prop({
    type: [
      {
        month: { type: Number, required: true },
        year: { type: Number, required: true },
        count: { type: Number, default: 0 },
      },
    ],
    default: [],
  })
  monthlyOverview?: { month: number; year: number; count: number }[];

  // @Prop({ type: [Types.ObjectId], ref: 'Book', default: [] })
  // monthlyOverview!: Types.ObjectId[];

  // @Prop({ type: [Types.ObjectId], ref: 'Book', default: [] })
  // todaysSchedule!: Types.ObjectId[];
}

export const DoctorRecordSchema = SchemaFactory.createForClass(DoctorRecord);

DoctorRecordSchema.index({ doctorId: 1, recordDate: 1 }, { unique: true });

