import { IsArray, IsNumber, IsObject, IsOptional } from 'class-validator';

export class UpdateChildRecordDto {
  @IsOptional()
  @IsObject()
  childData?: any;

  @IsOptional()
  @IsArray()
  growthHistory?: any[];

  @IsOptional()
  @IsObject()
  latestGrowth?: any;

  @IsOptional()
  @IsObject()
  currentStats?: any;

  @IsOptional()
  @IsArray()
  vaccinations?: any[];

  @IsOptional()
  @IsNumber()
  totalActivePatients?: number;

  @IsOptional()
  @IsNumber()
  monthlyPerformance?: number;

  @IsOptional()
  @IsArray()
  monthlyOverview?: { month: number; year: number; count: number }[];
}

