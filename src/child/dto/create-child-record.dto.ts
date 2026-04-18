import { IsMongoId } from 'class-validator';

export class CreateChildRecordDto {
  @IsMongoId()
  childId!: string;
}

