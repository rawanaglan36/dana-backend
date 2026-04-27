import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SendChatDto {
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsString()
  @IsOptional()
  conversationId?: string;
}

