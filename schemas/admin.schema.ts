import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AdminDocument = HydratedDocument<Admin>;

@Schema({ timestamps: true })
export class Admin {
  @Prop({
    type: String,
    required: true,
    min: [3, 'name must be at least 3 character'],
    max: [30, 'name must be at  most 30 character'],
  })
  adminName!: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  email!: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  phone!: string;

  @Prop({
    type: String,
    min: [3, 'password must be at least 3 characters'],
    max: [20, 'password must be at most 30 characters'],
    select: false,
  })
  password!: string;

  @Prop({
    type: String,
    default: 'admin',
  })
  role?: string;

  @Prop({
    type: Boolean,
    default: true,
  })
  isActive!: boolean;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);

