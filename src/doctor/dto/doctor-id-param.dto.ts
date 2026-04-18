import { IsMongoId } from 'class-validator';

export class DoctorIdParamDto {
  @IsMongoId()
  id!: string;
}

