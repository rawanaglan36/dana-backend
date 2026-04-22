import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { TextBookDocument, TextBook } from 'schemas/textBooks.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { responseDto } from 'src/response.dto';

@Injectable()
export class TextBooksService {
  constructor(@InjectModel(TextBook.name) private textBookModel: Model<TextBookDocument>) { }

  async findAll() {
    const books = await this.textBookModel.find().exec();
    return { response: new responseDto(200, 'success', books) };
  }

  async findOne(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid record');
    }
    const book = await this.textBookModel.findById(id).exec();
    return { response: new responseDto(200, 'success', book) };
  }

  async create(dto: CreateBookDto) {
    const book = new this.textBookModel(dto);
    const savedBook = await book.save();
    return { response: new responseDto(200, 'success', savedBook) };
  }

  async search(query) {
    if (!query) {
      throw new BadRequestException('Query is required');
    }

    const results = await this.textBookModel.find({
      $or: [
        /**DB INDEX */
        // { $text: { $search: query } }
        /**DB INDEX */
        
        /**REGEX */
        { title: { $regex: query, $options: 'i' } },
        { author: { $regex: query, $options: 'i' } }
        /**REGEX */
      ],
    });
    return { response: new responseDto(200, 'success', results) };
  }
}

