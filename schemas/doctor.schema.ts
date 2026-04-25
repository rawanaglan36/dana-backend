import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { min } from 'class-validator';
import { HydratedDocument, Types } from 'mongoose';

export type DoctorDocument = HydratedDocument<Doctor>;

@Schema({ timestamps: true })
export class Doctor {
  @Prop({
    type: String,
    required: true,
    min: [3, 'name must be at least 3 character'],
    max: [30, 'name must be at  most 30 character']
  })
  doctorName!: string;


  @Prop({
    type: String,
    // index: true,
  })
  email?: string;

  @Prop({
    type: String,
    min: [3, 'password must be at least 3 characters'],
    max: [20, "password must be at most 30 characters"],
    select: false
  })
  password?: string;

  @Prop({
    type: String,
    required: true,
  })
  phone!: string;

  @Prop({
    type: String,
    min: [3, 'address must be at least 3 character'],
    max: [30, 'address must be at  most 30 character']
  })
  address?: string;

  @Prop({
    type: String,
    min: [3, 'city must be at least 3 character'],
    max: [30, 'city must be at  most 30 character']
  })
  city?: string;


  @Prop({
    type: Number,
    default: 0.0
  })
  ratingAverage?: number;

  @Prop({
    type: Number,
    default: 0
  })
  ratingQuantity?: number;

  @Prop({
    type: String,
    required: true,
  })
  specialty!: string;

  @Prop({
    type: Number,
  })
  detectionPrice?: number;
  @Prop({
    type: String,
    required: true,
  })
  licenseNumber!: string;

  @Prop({
    type: Number,
    min: [1, 'must be at least 1 year experience']
  }
  )
  expirtes!: number;

  @Prop({ type: Number }
  )
  patintQuantity?: number;


  @Prop({
    type: [
      {
        date: { type: String, required: true },
        times: [{ type: String, required: true }]
      }
    ],
    default: []
  })
  availability?: { date: string; times: string[] }[];
  @Prop({
    type: String,
    default: 'doctor',
  })
  role?: string;

  @Prop({
    type: Number,
  })
  verficationCode?: number;

  @Prop({
    type: Boolean,
    default: false,
  })
  isVerified!: boolean;

  @Prop({
    type: Boolean,
    default: true,
  })
  isActive!: boolean;



  @Prop({
    type: String,
  })
  provider?: string;

  @Prop({
    type: String,
  })
  providerId?: string;

  @Prop({
    type: String,
  })
  details?: string;

  @Prop({
    type: String,
    default: null,
    nullable: true
  })
  profileImage?: string;

  @Prop({
    type: String,
    default: null,
    nullable: true
  })
  profileImagePublicId?: string;

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'booking' }],
  })
  bookings?: Types.ObjectId[];

  @Prop({ type: String })
  bio?: string;

  @Prop({ type: [String], default: [] })
  dayOff?: string[];

  @Prop({ type: Number })
  consultTime?: number;

  @Prop({ type: String })
  cv?: string;

  @Prop({ type: Boolean, default: true })
  appointmentNotification?: boolean;

  @Prop({ type: Boolean, default: true })
  cancellationsNotification?: boolean;

  @Prop({ type: Boolean, default: true })
  patientUpdateNotification?: boolean;

  @Prop({ type: Boolean, default: true })
  messageNotification?: boolean;
}

export const DoctorSchema = SchemaFactory.createForClass(Doctor);



