import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import {  TextBooksService } from './textBooks.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Controller('v1/textBooks')
export class TextBooksController {
  constructor(private readonly textBooksService: TextBooksService) { }


  @Get('search')
  async search(
    @Query('q') query: string
  ) {
    return this.textBooksService.search(query);
  }

  @Get()
  async getAllBooks() {
    return this.textBooksService.findAll();
  }

  @Get(':id')
  async getBook(@Param('id') id: string) {
    return this.textBooksService.findOne(id);
  }

  @Post()
  async createBook(@Body() dto: CreateBookDto) {
    return this.textBooksService.create(dto);
  }


}