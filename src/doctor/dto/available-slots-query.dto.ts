import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class AvailableSlotsQueryDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'invalid input' })
  date!: string;
}

