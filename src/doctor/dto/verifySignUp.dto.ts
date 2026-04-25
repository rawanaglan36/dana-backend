import {
  IsString,
  IsEmail,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsArray,
  MinLength,
  MaxLength,
  IsPhoneNumber,
  IsNotEmpty,
} from 'class-validator';

export class verifySignInDto {

  @IsString({ message: 'email must be a string' })
  @IsEmail()
  @IsNotEmpty({ message: 'email is required' })

  email: string;

  // @IsOptional()
  @IsNumber()
  @IsNotEmpty({ message: 'otp is required' })
  otp: number;
}
