import {
  IsEnum,
  IsIn,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  isString,
  Matches,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateParentDto } from 'src/parent/dto/create-parent.dto';
import { CreateChildDto } from 'src/parent/dto/child.dto';
import { CreateDoctorDto } from 'src/doctor/dto/create-doctor.dto';

export class CreateBookingDto {
  @IsMongoId()
  doctorId!: string;
  @IsMongoId()
  parentId!: string;
  @IsMongoId()
  childId!: string;

  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'date must be in format yyyy-mm-dd',
  })
  date!: string;

  @IsString()
  @Matches(/^\d{2}:\d{2}$/, { message: 'time must be HH:MM' })
  time!: string;

  @IsString()
  @IsIn(['on-visit', 'visa'])
  @IsNotEmpty()
  paymentMethod!: string;

  @IsString()
  @IsIn(['examination', 'follow-up'])
  visitStatus!: string;

  @IsString()
  notes!: string;

  //payment
  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsEnum(['pending', 'confirmed', 'cancelled'])
  status?: 'pending' | 'confirmed' | 'cancelled';

  @IsOptional()
  @IsEnum(['pending', 'paid', 'failed'])
  paymentStatus?: 'pending' | 'paid' | 'failed';

  @IsOptional()
  @IsString()
  paymentProvider?: string;


  @IsString()
  @IsOptional()
  paymobOrderId?: string;

  @IsString()
  @IsOptional()
  paymobTransactionId?: string;

  @IsNumber()
  @IsOptional()
  detectionPrice?: number;

  // @IsString()
  // @IsOptional()
  // profileImage?: string;

  // @IsString()
  // @IsOptional()
  // profileImagePublicId?: string;
}
