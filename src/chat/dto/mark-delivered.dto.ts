import { ArrayMaxSize, IsArray, IsMongoId, IsString } from 'class-validator';

export class MarkDeliveredDto {
  @IsMongoId()
  parentId!: string;

  @IsMongoId()
  doctorId!: string;

  @IsArray()
  @ArrayMaxSize(200)
  @IsMongoId({ each: true })
  messageIds!: string[];
}
