// src/skill/dto/create-skill.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateSkillDto {
    @IsString()
    @IsNotEmpty({ message: 'اسم المهارة مطلوب' })
    name!: string;
}