import { IsArray, IsMongoId, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class DoctorRecordStatusCountDto {
  @IsOptional()
  @IsNumber()
  completed?: number;

  @IsOptional()
  @IsNumber()
  cancelled?: number;

  @IsOptional()
  @IsNumber()
  pending?: number;
}

class DoctorRecordPaymentMethodCountDto {
  @IsOptional()
  @IsNumber()
  visa?: number;

  @IsOptional()
  @IsNumber()
  cash?: number;
}

class MonthlyOverviewDto {


  @IsOptional()
  @IsString()
  date?: string;
  
  @IsOptional()
  @IsNumber()
  count?: number;
}


export class UpdateDoctorRecordDto {
  @IsOptional()
  @IsNumber()
  todaysAppointmentsCount?: number;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  todaysAppointments?: string[];

  @IsOptional()
  @ValidateNested()
  @Type(() => DoctorRecordStatusCountDto)
  appointmentStatusCount?: DoctorRecordStatusCountDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => DoctorRecordPaymentMethodCountDto)
  paymentMethodCount?: DoctorRecordPaymentMethodCountDto;
  
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MonthlyOverviewDto)
  monthlyOverview: MonthlyOverviewDto[];
  
  // @IsOptional()
  // @IsArray()
  // @IsMongoId({ each: true })
  // monthlyOverview?: string[];

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  todaysSchedule?: string[];
}

