import { IsOptional, IsString, IsDateString } from 'class-validator';

export class TakeVaccineDto {
    // @IsOptional()
    @IsDateString()
    takenDate!: string;

    @IsOptional()
    @IsString()
    notes?: string;
}