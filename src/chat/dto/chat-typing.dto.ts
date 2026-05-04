import { Transform } from 'class-transformer';
import { IsBoolean, IsMongoId } from 'class-validator';

export class ChatTypingDto {
  @IsMongoId()
  parentId!: string;

  @IsMongoId()
  doctorId!: string;

  @Transform(({ value }) => value === true || value === 'true')
  @IsBoolean()
  isTyping!: boolean;
}
