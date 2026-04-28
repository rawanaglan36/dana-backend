import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Video, VideosDocument } from 'schemas/videos.schema copy';
import { Model, Types } from 'mongoose';
import { responseDto } from 'src/response.dto';
import { BADFAMILY } from 'dns';

@Injectable()
export class VideosService {
  constructor(@InjectModel(Video.name) private videoModel: Model<VideosDocument>) { }

  async findAll() {
    const videos = await this.videoModel.find().exec();
    return { response: new responseDto(200, 'success', videos) };
  }

  async findOne(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid record');
    }
    const video = await this.videoModel.findById(id).exec();
    return { response: new responseDto(200, 'success', video) };
  }

  async create(dto: CreateVideoDto) {
    const book = new this.videoModel(dto);
    const savedVideo = await book.save();
    return { response: new responseDto(200, 'success', savedVideo) };
  }

  async search(query) {
    if (!query) {
      throw new BadRequestException('Query is required');
    }

    const results = await this.videoModel.find({
      $or: [
        /**DB INDEX */
        // { $text: { $search: query } }
        /**DB INDEX */
        
        /**REGEX */
        { title: { $regex: query, $options: 'i' } },
        /**REGEX */
      ],
    });
    return { response: new responseDto(200, 'success', results) };
  }

  async remove(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid record');
    }
    const book = await this.videoModel.findByIdAndDelete(id).exec();
    return { response: new responseDto(200, 'success', book) };
  }

  async update(id: string, dto: UpdateVideoDto) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid record');
    }
    const book = await this.videoModel.findByIdAndUpdate(id, dto, { new: true }).exec();
    return { response: new responseDto(200, 'success', book) };
  }
}
