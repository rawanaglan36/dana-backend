import {
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  IsPhoneNumber,
  IsNotEmpty,
} from 'class-validator';

export class AdminSignUpDto {
  @IsString({ message: 'must be string' })
  @MinLength(3, { message: 'Name must be at least 3 characters' })
  @MaxLength(30, { message: 'Name must be at most 30 characters' })
  @IsNotEmpty({ message: 'adminName is required' })
  adminName!: string;

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
  phone!: string;

  @IsString({ message: 'must be string' })
  @MinLength(3, { message: 'Password must be at least 3 characters' })
  @MaxLength(20, { message: 'Password must be at most 20 characters' })
  @IsNotEmpty({ message: 'password is required' })
  password!: string;
}

