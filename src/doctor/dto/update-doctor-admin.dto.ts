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

export class UpdateDoctorAdminDto {
    @IsOptional()
    @IsBoolean()
    isAvailable: boolean;
    
    @IsOptional()
    @IsBoolean()
    isVerified: boolean;
}
