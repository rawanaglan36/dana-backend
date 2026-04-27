// cloudinary.service.ts

import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryResponse } from '../upload-file/cloudinary.rsponse';
const streamifier = require('streamifier');

@Injectable()
export class CloudinaryService {
  uploadFile(file: Express.Multer.File): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {

      const isDocument =
        file.mimetype.includes('pdf') ||
        file.mimetype.includes('word');

      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: isDocument ? "raw" : "image",
        },
        (error, result) => {
          if (error) return reject(error);
          if (!result) return reject(new Error('Upload failed'));
          resolve(result);
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
      
    });
  }
    async uploadFiles(files: any[]): Promise<CloudinaryResponse[]> {
    return Promise.all(files.map(file => this.uploadFile(file)));}

    async deleteFile(publicId: string): Promise<any> {
  return await cloudinary.uploader.destroy(publicId,{invalidate: true});
  
}

}
