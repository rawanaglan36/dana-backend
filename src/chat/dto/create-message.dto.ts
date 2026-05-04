// chat/dto/create-message.dto.ts
import { IsString, IsNotEmpty, IsEnum, IsOptional, IsMongoId } from 'class-validator';

export class CreateMessageDto {
  @IsMongoId()
  parentId: string;

  @IsMongoId()
  doctorId: string;

  @IsString()
  @IsNotEmpty()
  roomId: string;

  @IsMongoId()
  senderId: string;

  @IsMongoId()
  receiverId: string;

  @IsEnum(['Parent', 'Doctor'])
  senderModel: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsEnum(['TEXT', 'IMAGE', 'DOCUMENT'])
  @IsOptional()
  type?: string;

  @IsString()
  @IsOptional()
  clientMessageId?: string;
}