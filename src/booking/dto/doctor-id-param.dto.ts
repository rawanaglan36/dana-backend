import { IsMongoId } from 'class-validator';

export class DoctorIdParamDto {
  @IsMongoId()
  doctorId!: string;
}

