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

export class UpdateDoctorAppointmentsDto {
    @IsArray()
    // @IsString({each:true})
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        each: true,
        message: 'date must be in format yyyy-mm-dd',
    })
    avilableDate: string[];

    @IsArray()
    // @IsString({each:true})
    @Matches(/^\d{2}:\d{2}$/, { each: true, message: 'time must be HH:MM' })
    avilableTime: string[];



    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    dayOff?: string[];

    @IsOptional()
    @IsNumber()
    @Min(1, { message: 'consultTime must be at least 1 minute' })
    consultTime?: number;
}