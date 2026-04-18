// src/skill/dto/create-bulk-skill-items.dto.ts
import { IsArray, ValidateNested, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateSkillItemDto } from './create-skill-item.dto';

export class CreateBulkSkillItemsDto {
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateSkillItemDto)
  items!: CreateSkillItemDto[];
}