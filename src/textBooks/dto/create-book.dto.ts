// src/dto/create-book.dto.ts
import { IsString, IsOptional, IsArray, ValidateNested, IsUrl, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';


export class CreateBookDto {
    @IsString()
    @IsNotEmpty()
    title!: string;

    @IsString()
    @IsNotEmpty()
    author!: string;

    @IsString()
    @IsNotEmpty()
    description!: string;

    @IsOptional()
    @IsString()
    cover?: string;

    @IsString()
    @IsNotEmpty()
    @IsUrl()
    link!: string;


}