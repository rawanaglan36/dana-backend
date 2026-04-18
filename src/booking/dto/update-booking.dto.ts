import { PartialType } from '@nestjs/mapped-types';
import { CreateBookingDto } from './create-booking.dto';
import { IsMongoId, IsString, Matches } from 'class-validator';

export class UpdateBookingDto {

    @IsMongoId()
    doctorId!: string;

    @IsMongoId()
    parentId!: string;
    @IsString()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'date must be in format yyyy-mm-dd',
    })
    date!: string;

    @IsString()
    @Matches(/^\d{2}:\d{2}$/, { message: 'time must be HH:MM' })
    time!: string;
}
