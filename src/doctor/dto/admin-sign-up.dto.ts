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
    min,
    MIN,
    Min,
    IsDateString,
    isArray,
    Matches,
  } from 'class-validator';
  
  export class AdminSignUpDto {

    @IsString({ message: 'email must be string' })
    @MinLength(0, { message: 'email must be required' })
    @IsEmail()
    @IsNotEmpty({ message: 'email is required' })
    email: string;
  
    @IsString({ message: 'phoneNumber must be a string' })
    @IsPhoneNumber('EG', {
      message: 'phoneNumber must be a Egyptian phone number',
    })
    @IsNotEmpty({ message: 'phone is required' })
    phone: string;
  
    @IsOptional()
    @IsString()
    role: string = 'doctor';
  
    @IsOptional()
    @IsBoolean()
    isActive?: boolean=true;
  
    @IsString({ message: 'must be string' })
    @MinLength(3, { message: 'Password must be at least 3 characters' })
    @MaxLength(20, { message: 'Password must be at most 20 characters' })
    @IsNotEmpty({ message: 'password is required' })
    password: string;
  
  }
  