import { Module } from '@nestjs/common';
import { VideosService } from './videos.service';
import { VideosController } from './videos.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Video, VideoSchema } from 'schemas/videos.schema copy';

@Module({
  imports: [MongooseModule.forFeature([{ name: Video.name, schema: VideoSchema }])],
  controllers: [VideosController],
  providers: [VideosService],
})
export class VideosModule { }
