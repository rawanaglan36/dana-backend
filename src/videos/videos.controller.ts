import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { VideosService } from './videos.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';

@Controller('v1/videos')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  
  
    @Get('search')
    async search(
      @Query('q') query: string
    ) {
      return this.videosService.search(query);
    }
  
    @Get()
    async getAllBooks() {
      return this.videosService.findAll();
    }
  
    @Get(':id')
    async getBook(@Param('id') id: string) {
      return this.videosService.findOne(id);
    }
  
    @Post()
    async createBook(@Body() dto: CreateVideoDto) {
      return this.videosService.create(dto);
    }

      @Delete(':id')
      async deleteBook(@Param('id') id: string) {
        return this.videosService.remove(id);
      }
      
      @Patch(':id')
      async updateBook(@Param('id') id: string, @Body() dto: UpdateVideoDto) {
        return this.videosService.update(id, dto);
      }
  
  

}
