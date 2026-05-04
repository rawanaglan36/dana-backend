import { Transform } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsMongoId,
  IsOptional,
  ValidateIf,
} from 'class-validator';

export class MarkReadDto {
  @IsMongoId()
  parentId!: string;

  @IsMongoId()
  doctorId!: string;

  @IsOptional()
  @Transform(({ value }) => value === true || value === 'true')
  @IsBoolean()
  readAll?: boolean;

  @ValidateIf((o) => !o.readAll)
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(200)
  @IsMongoId({ each: true })
  messageIds?: string[];
}
