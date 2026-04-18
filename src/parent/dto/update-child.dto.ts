import { PartialType } from '@nestjs/mapped-types';
import { CreateChildDto } from './child.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateChildDto extends PartialType(CreateChildDto) {
    @IsOptional()
    @IsString()
    profileImage?: string;

    @IsOptional()
    @IsString()
    profileImagePublicId?: string;
}
