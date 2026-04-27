// src/auth/dto/complete-oauth.dto.ts
import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsOptional,
  IsEnum,
  IsPhoneNumber,
  IsDateString,
  ValidateNested,
  IsArray,
  IsBoolean,
  IsNumber,
} from 'class-validator';

class ChildDto {
  @IsString({ message: 'childName must be a string' })
  @MinLength(3)
  @MaxLength(30)
  @IsNotEmpty()
  childName: string;

  @IsOptional()
  @IsNumber()
  age?: number;

  @IsEnum(['male', 'female'])
  @IsNotEmpty()
  gender: string;

  @IsDateString()
  birthDate: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class CompleteOAuthDto {
  ////////////////
  // // Parent fields
  // @IsString()
  // @IsNotEmpty()
  // tempKey: string; // Redis temp key

  @IsString()
  @IsPhoneNumber('EG')
  @IsNotEmpty()
  phone: string;

  @IsString()
  @MinLength(3)
  @MaxLength(20)
  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsString()
  government?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  //////////////////
  // Children
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChildDto)
  children: ChildDto[];
}
