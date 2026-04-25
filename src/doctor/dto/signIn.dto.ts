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

  @IsString({ message: 'email must be string' })
  @MinLength(0, { message: 'email must be required' })
  @IsEmail()
  email: string;

  @IsString({ message: 'must be string' })
  @MinLength(3, { message: 'Password must be at least 3 characters' })
  @MaxLength(20, { message: 'Password must be at most 20 characters' })
  password: string;
}
