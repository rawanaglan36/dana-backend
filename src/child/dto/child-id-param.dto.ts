import { IsMongoId } from 'class-validator';

export class ChildIdParamDto {
  @IsMongoId()
  childId!: string;
}

