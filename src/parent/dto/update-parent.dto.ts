import { PartialType } from '@nestjs/mapped-types';
import { CreateParentDto } from './create-parent.dto';
import {
    IsString,
    IsEmail,
    IsOptional,
    IsBoolean,
    IsNumber,
    IsArray,
    MinLength,
    MaxLength,
    IsPhoneNumber,
    IsNotEmpty,
} from 'class-validator';

export class UpdateParentDto extends PartialType(CreateParentDto) {
    @IsString({ message: 'must be string' })
    @MinLength(3, { message: 'Name must be at least 3 characters' })
    @MaxLength(30, { message: 'Name must be at most 30 characters' })
    @IsNotEmpty({ message: 'parentName is required' })
    parentName!: string;


    @IsString({ message: 'email must be string' })
    @MinLength(0, { message: 'email must be required' })
    @IsEmail()
    @IsNotEmpty({ message: 'email is required' })
    email!: string;

    @IsString({ message: 'phoneNumber must be a string' })
    @IsPhoneNumber('EG', {
        message: 'phoneNumber must be a Egyptian phone number',
    })
    @IsNotEmpty({ message: 'phone is required' })

    // require:true
    phone!: string;


    @IsOptional()
    @IsNumber()
    verficationCode?: number;

    @IsOptional()
    @IsBoolean()
    isVerified?: boolean;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    //   @IsOptional()
    @IsString()
    @IsNotEmpty({ message: 'government is required' })
    government!: string;

    //   @IsOptional()
    @IsString()
    @IsNotEmpty({ message: 'address is required' })
    address!: string;



    @IsOptional()
    @IsString()
    provider?: string;

    @IsOptional()
    @IsString()
    providerId?: string;

    @IsString()
    @IsOptional()
    profileImage?: string;

    @IsString()
    @IsOptional()
    profileImagePublicId?: string;
}
