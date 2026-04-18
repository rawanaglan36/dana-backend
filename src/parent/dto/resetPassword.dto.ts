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

export class ResetPasswordDto {
  // @IsString({ message: "email must be string" })
  // @MinLength(0, { message: "email must be required" })
  // @IsEmail()
  // email: string;

  @IsString({ message: 'phoneNumber must be a string' })
  @IsPhoneNumber('EG', {
    message: 'phoneNumber must be a Egyptian phone number',
  })
  @IsNotEmpty({ message: 'phone is required' })

  // require:true
  phone: string;
}
