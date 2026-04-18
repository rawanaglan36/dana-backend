import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Video, VideosDocument } from 'schemas/videos.schema copy';
import { Model, Types } from 'mongoose';
import { BADFAMILY } from 'dns';

@Injectable()
export class VideosService {
  constructor(@InjectModel(Video.name) private videoModel: Model<VideosDocument>) { }

  async findAll() {
    return this.videoModel.find().exec();
  }

  async findOne(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid record');
    }
    return this.videoModel.findById(id).exec();
  }

  async create(dto: CreateVideoDto) {
    const book = new this.videoModel(dto);
    return book.save();
  }

  async search(query) {
    if (!query) {
      throw new BadRequestException('Query is required');
    }

    return this.videoModel.find({
      $or: [
        /**DB INDEX */
        // { $text: { $search: query } }
        /**DB INDEX */
        
        /**REGEX */
        { title: { $regex: query, $options: 'i' } },
        /**REGEX */
      ],
    });
  }
}
