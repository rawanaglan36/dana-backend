import { Type } from 'class-transformer';
import { ValidateNested, ArrayMinSize } from 'class-validator';
import { CreateVaccineDto } from './create-vaccine.dto';

export class createBulkVaccineDto {
    @ValidateNested({ each: true })
    @Type(() => CreateVaccineDto)
    @ArrayMinSize(1)
    vaccines!: CreateVaccineDto[];
}