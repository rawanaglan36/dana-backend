// option.dto.ts

import { IsString, IsNumber, Min, Max } from 'class-validator';

export class OptionDto {
    @IsString()
    label!: string;

    @IsNumber()
    @Min(0)
    @Max(3)
    value!: number;
}