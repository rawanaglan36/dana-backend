import { IsString, IsNumber, IsIn, IsBoolean, IsOptional } from 'class-validator';

export class CreateVaccineDto {
    @IsString()
    name!: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsNumber()
    scheduleValue!: number;

    @IsIn(['hours', 'days', 'weeks', 'months'])
    scheduleUnit!: string;

    @IsOptional()
    @IsBoolean()
    isMandatory?: boolean;
}