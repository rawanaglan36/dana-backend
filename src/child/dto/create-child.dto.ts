import {
  IsString,
  IsNumber,
  MinLength,
  MaxLength,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsDateString,
  IsArray,
  IsNotEmpty,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreateChildDto {
  @IsString({ message: 'childName must be a string' })
  @MinLength(3, { message: 'childName must be at least 3 characters' })
  @MaxLength(30, { message: 'childName must be at most 30 characters' })
  @IsNotEmpty({ message: 'childName is required' })
  childName!: string;

  @IsOptional()
  @IsNumber({}, { message: 'age must be a number' })
  age?: number;

  @IsEnum(['male', 'female'], {
    message: 'gender must be either male or female',
  })
  @IsNotEmpty({ message: 'gender is required' })
  gender!: string;

  @IsOptional()
  // @IsArray({ message: "role must be an array of strings" })
  @IsString({ each: true })
  role?: string;

  @IsDateString({}, { message: 'birthDate must be a valid date string' })
  @IsNotEmpty({ message: 'birthDate is required' })
  birthDate!: Date;

  @IsOptional()
  @IsBoolean({ message: 'isActive must be a boolean' })
  isActive?: boolean;

  // @IsString({ message: "parentId must be a string" })
  // parentId: Types.ObjectId;

  @IsOptional()
  @IsArray({ message: 'bookings must be an array' })
  bookings?: Types.ObjectId[];
}
