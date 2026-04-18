import { IsArray, ArrayMinSize, ArrayMaxSize, IsNumber } from 'class-validator';
import { AnswerDto } from './answer.dto';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSensoryTestDto {

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => AnswerDto)
    answers!: AnswerDto[];
}