import { PartialType } from '@nestjs/mapped-types';
import { CreateDoctorDto } from './create-doctor.dto';
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

export class UpdateDoctorDto extends PartialType(CreateDoctorDto) {
    @IsString({ message: 'must be string' })
    @MinLength(3, { message: 'Name must be at least 3 characters' })
    @MaxLength(30, { message: 'Name must be at most 30 characters' })
    @IsNotEmpty({ message: 'parentName is required' })
    doctorName: string;

    @IsString({ message: 'must be string' })
    @MinLength(3, { message: 'Name must be at least 3 characters' })
    @MaxLength(30, { message: 'Name must be at most 30 characters' })
    @IsNotEmpty({ message: 'parentName is required' })
    address: string;


    @IsString({ message: 'phoneNumber must be a string' })
    @IsPhoneNumber('EG', {
        message: 'phoneNumber must be a Egyptian phone number',
    })
    @IsNotEmpty({ message: 'phone is required' })

    // require:true
    phone: string;


    //   @IsOptional()
    @IsNumber()
    @IsNotEmpty({ message: 'detection price is required' })
    detectionPrice: number;

    //   @IsOptional()
    @IsNumber()
    @Min(1, { message: 'must at least 1 year experts' })
    expirtes: number;

    //   @IsOptional()
    @IsString()
    @IsNotEmpty({ message: 'address is required' })
    specialty: string;

    //   @IsString({ message: 'must be string' })
    //   @MinLength(3, { message: 'Password must be at least 3 characters' })
    //   @MaxLength(20, { message: 'Password must be at most 20 characters' })
    //   @IsNotEmpty({ message: 'password is required' })
    //   password: string;


    //   @IsOptional()
    //   @IsString()
    //   details?: string;

    @IsOptional()
    @IsString()
    profileImage?: string;

    @IsOptional()
    @IsString()
    profileImagePublicId?: string;

    @IsOptional()
    @IsString()
    bio?: string;



    // @IsOptional()
    // @IsString()
    // cv?: string;


}
