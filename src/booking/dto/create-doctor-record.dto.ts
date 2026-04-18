import { IsMongoId } from 'class-validator';

export class CreateDoctorRecordDto {
  @IsMongoId()
  doctorId!: string;
}

