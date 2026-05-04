import { IsMongoId } from 'class-validator';

export class MarkReadDto {
  @IsMongoId()
  messageId: string;
}
