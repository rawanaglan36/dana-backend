// src/skill/dto/create-skill-item.dto.ts
import { IsString, IsNotEmpty, IsMongoId } from 'class-validator';

export class CreateSkillItemDto {
    @IsString()
    @IsNotEmpty({ message: 'عنوان البند مطلوب' })
    title!: string;

    @IsMongoId({ message: 'skillId غير صالح' })
    skillId!: string;
}