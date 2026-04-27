// src/upload/upload.controller.ts
import { Body, Controller, Post, UploadedFile, UseInterceptors, HttpException, HttpStatus, Req, UseGuards, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, UploadedFiles } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../upload-file/upload-file.service';
import { Roles } from 'src/parent/decorator/Roles.decorator';
import { AuthGuard } from '@nestjs/passport';

@Controller('v1/image')
export class UploadController {
  constructor(private readonly cloudinaryService: CloudinaryService) { }

  @Post('upload') // POST /v1/image/upload
  // @Roles(['parent', 'admin', 'doctor'])
  // @UseGuards(AuthGuard)
  @UseInterceptors(
    // FileInterceptor('file')
    FilesInterceptor('files[]', 5)
  )
  async uploadImage(
    // @UploadedFile(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 100000, // 100 KB
          }),
          new FileTypeValidator({
            fileType: /(jpg|jpeg|png|pdf|doc|docx)$/i,
          }),

        ],
      }),
      // ) files: Express.Multer.File[],
    ) files: any,
  ) {
    if (!files) {
      throw new HttpException('No file provided', HttpStatus.BAD_REQUEST);
    }

    // console.log(files);
    // return await this.cloudinaryService.uploadFile(file);
    return await this.cloudinaryService.uploadFiles(files);
  }
}
