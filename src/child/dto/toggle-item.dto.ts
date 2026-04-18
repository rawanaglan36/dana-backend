// src/skill/dto/toggle-item.dto.ts
import { IsBoolean, IsMongoId } from 'class-validator';

export class ToggleItemDto {
  @IsMongoId()
  itemId!: string;

  @IsBoolean()
  checked!: boolean;
}