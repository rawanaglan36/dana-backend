// src/upload/upload.module.ts
import { Module } from '@nestjs/common';
import { UploadController } from '../upload-file/upload-file.controller';
import { CloudinaryService } from '../upload-file/upload-file.service';
import { CloudinaryProvider } from '../upload-file/cloudinary.provider';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [UploadController],
  providers: [CloudinaryProvider, CloudinaryService],
    exports: [CloudinaryService],
})
export class UploadModule {}
