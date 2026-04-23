import {
  IsString,
  IsNumber,
  IsEmail,
  IsBoolean,
  IsOptional,
  IsEnum,
  MinLength,
  MaxLength,
  Min,
  IsUrl,
  isPhoneNumber,
  IsPhoneNumber,
  Length,
  length,
  minLength,
} from 'class-validator';

export class SingInDto {
  @IsString({ message: 'phoneNumber must be a string' })
  @IsPhoneNumber('EG', {
    message: 'phoneNumber must be a Egyptian phone number',
  })
  phone: string;

  @IsString({ message: 'must be string' })
  @MinLength(3, { message: 'Password must be at least 3 characters' })
  @MaxLength(20, { message: 'Password must be at most 20 characters' })
  password: string;
}
