import { Type } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsMongoId,
  IsOptional,
  Max,
  Min,
} from 'class-validator';

export class ListRealtimeMessagesQueryDto {
  @IsMongoId()
  parentId!: string;

  @IsMongoId()
  doctorId!: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(200)
  limit?: number;

  /** Load messages strictly older than this ISO timestamp (cursor for pagination). */
  @IsOptional()
  @IsDateString()
  before?: string;
}
