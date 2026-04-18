import { PartialType } from '@nestjs/mapped-types';
import { CreateNotificationDto } from './create-notification.dto';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateNotificationDto extends PartialType(CreateNotificationDto) {
    @IsBoolean()
    isRead!: boolean;

    @IsOptional()
    @IsString()
    response?: string;
}
