// create-question.dto.ts

import {
    IsString,
    IsArray,
    ArrayMinSize,
    ValidateNested,
    IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OptionDto } from './options.dto';

export class CreateQuestionDto {
    @IsString()
    text!: string;

    @IsString()
    @IsIn(['seeking', 'avoiding', 'sensitivity', 'registration'])
    category!: string;

    @IsArray()
    @ArrayMinSize(3) // 
    @ValidateNested({ each: true })
    @Type(() => OptionDto)
    options!: OptionDto[];
}