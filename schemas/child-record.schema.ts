import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ChildRecordDocument = HydratedDocument<ChildRecord>;

@Schema({ timestamps: true })
export class ChildRecord {
  @Prop({ type: Types.ObjectId, ref: 'Child', required: true, index: true })
  childId!: Types.ObjectId;

  @Prop({ type: Date, required: true, index: true })
  recordDate!: Date;

  @Prop({ type: Object, default: {} })
  childData!: any;

  @Prop({ type: [Object], default: [] })
  growthHistory!: any[];

  @Prop({ type: Object, default: null })
  latestGrowth!: any;

  @Prop({ type: Object, default: {} })
  currentStats!: any;

  @Prop({ type: [Object], default: [] })
  vaccinations!: any[];

  /** Count of all children with isActive: true (snapshot at generate time). */
  @Prop({ type: Number, required: false })
  totalActivePatients?: number;

  /** Bookings for this child in the calendar month of recordDate. */
  @Prop({ type: Number, required: false })
  monthlyPerformance?: number;

  /** Bookings for this child in recordDate's year, one entry per month (1–12). */
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
}

export const ChildRecordSchema = SchemaFactory.createForClass(ChildRecord);

ChildRecordSchema.index({ childId: 1, recordDate: 1 }, { unique: true });

