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

export class CreateDoctorDto {
  @IsString({ message: 'must be string' })
  @MinLength(3, { message: 'Name must be at least 3 characters' })
  @MaxLength(30, { message: 'Name must be at most 30 characters' })
  @IsNotEmpty({ message: 'parentName is required' })
  doctorName: string;

  @IsString({ message: 'must be string' })
  @MinLength(3, { message: 'Name must be at least 3 characters' })
  @MaxLength(30, { message: 'Name must be at most 30 characters' })
  @IsOptional()
  address: string;

  @IsString({ message: 'must be string' })
  @MinLength(3, { message: 'Name must be at least 3 characters' })
  @MaxLength(30, { message: 'Name must be at most 30 characters' })
  @IsOptional()
  city: string;

  // @IsOptional()
  // @IsNumber()
  // ratingAverage?: number;

  // @IsOptional()
  // @IsNumber()
  // ratingQuantity?: number;

  // @IsOptional()
  // @IsNumber()
  // patintQuantity?: number;

  @IsString({ message: 'email must be string' })
  @MinLength(0, { message: 'email must be required' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString({ message: 'phoneNumber must be a string' })
  @IsPhoneNumber('EG', {
    message: 'phoneNumber must be a Egyptian phone number',
  })
  @IsNotEmpty({ message: 'phone is required' })
  // require:true
  phone: string;

  @IsOptional()
  @IsString()
  role: string = 'doctor';

  @IsOptional()
  @IsBoolean()
  isActive?: boolean=true;

  //   @IsOptional()
  @IsNumber()
  @Min(1, { message: 'must at least 1 year experts' })
  @IsNotEmpty({ message: 'expirtes is required' })
  expirtes: number;

  //   @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'address is required' })
  specialty: string;

  @IsString()
  @IsNotEmpty({ message: 'license number is required' })
  licenseNumber: string;



  // @IsOptional()
  // @IsString()
  // provider?: string;

  // @IsOptional()
  // @IsString()
  // providerId?: string;

  // @IsOptional()
  // @IsString()
  // details?: string;

  // @IsOptional()
  // @IsString()
  // profileImage?: string;

  // @IsOptional()
  // @IsString()
  // profileImagePublicId?: string;

  // @IsString()
  // startDate: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  cv?: string;

  @IsOptional()
  @IsString()
  cvPublicId?: string;
}
