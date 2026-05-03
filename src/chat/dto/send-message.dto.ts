import { IsMongoId, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class SendMessageDto {
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  parentId: string;

  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  doctorId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  message: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  clientMessageId?: string;
}

