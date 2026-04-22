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
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class AvailabilityDto {
    @IsString()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'date must be in format yyyy-mm-dd' })
    date: string;

    @IsArray()
    @IsString({ each: true })
    @Matches(/^\d{2}:\d{2}$/, { each: true, message: 'time must be HH:MM' })
    times: string[];
}

export class UpdateDoctorAppointmentsDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => AvailabilityDto)
    availability: AvailabilityDto[];



    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    dayOff?: string[];

    @IsOptional()
    @IsNumber()
    @Min(1, { message: 'consultTime must be at least 1 minute' })
    consultTime?: number;
}