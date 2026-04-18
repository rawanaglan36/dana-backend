import { IsNumber, IsDateString } from 'class-validator';

export class CreateGrowthDto {
  @IsNumber()
  height!: number;

  @IsNumber()
  weight!: number;

  @IsNumber()
  headCircumference!: number;

  @IsDateString()
  recordDate!: string;
}