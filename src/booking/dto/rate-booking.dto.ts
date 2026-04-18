import { IsInt, Max, Min } from 'class-validator';

export class RateBookingDto {
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;
}
