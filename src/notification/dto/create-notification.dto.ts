import { IsArray, IsDate, IsEnum, IsObject, IsOptional, IsString } from "class-validator";

export class CreateNotificationDto {

    @IsString()
    userId!: string;

    @IsString()
    title!: string;

    @IsString()
    body!: string;

    @IsEnum(['BOOKING', 'PAYMENT', 'REMINDER', 'CHAT'])
    type!: string;

    @IsOptional()
    @IsObject()
    data?: any;

    @IsOptional()
    @IsDate()
    scheduledAt?: Date;

    @IsOptional()
    @IsString()
    repeat?: string;

    @IsOptional()
    @IsString()
    response?: string;

    @IsOptional()
    @IsArray()
    actions?: Array<any>;
}
