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
    IsNotEmpty,
  } from 'class-validator';
  
  export class checkAvailabilityDto {
    
    @IsString({ message: 'email must be string' })
@MinLength(0, { message: 'email must be required' })
@IsEmail()
@IsNotEmpty({ message: 'email is required' })
email!: string;

@IsString({ message: 'phoneNumber must be a string' })
@IsPhoneNumber('EG', {
  message: 'phoneNumber must be a Egyptian phone number',
})
@IsNotEmpty({ message: 'phone is required' })

// require:true
phone!: string;
  }