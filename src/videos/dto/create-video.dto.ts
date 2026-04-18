import { IsString, IsOptional, IsArray, ValidateNested, IsUrl, IsNotEmpty, IsNumber, Matches } from 'class-validator';
export class CreateVideoDto {

    @IsString()
    @IsNotEmpty()
    title!: string;


    @IsString()
    @IsNotEmpty()
    description!: string;

    @IsOptional()
    @IsString()
    cover?: string;

    @IsOptional()
    @IsNumber()
    views?: Number;

    @IsString()
    @IsNotEmpty()
    @IsUrl()
    link!: string;

    @IsString()
    @IsNotEmpty()
    @Matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, {
        message: 'Time must be in format HH:mm:ss',
    })
    time!: string;

}
