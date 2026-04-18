import { IsBoolean, IsOptional } from "class-validator";

export class UpdateDoctorNotificationsDto {
  @IsOptional()
  @IsBoolean()
  appointmentNotification?: boolean;

  @IsOptional()
  @IsBoolean()
  cancellationsNotification?: boolean;

  @IsOptional()
  @IsBoolean()
  patientUpdateNotification?: boolean;

  @IsOptional()
  @IsBoolean()
  messageNotification?: boolean;
}