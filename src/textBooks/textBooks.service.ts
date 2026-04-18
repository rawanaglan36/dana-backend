import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { TextBookDocument, TextBook } from 'schemas/textBooks.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class TextBooksService {
  constructor(@InjectModel(TextBook.name) private textBookModel: Model<TextBookDocument>) { }

  async findAll() {
    return this.textBookModel.find().exec();
  }

  async findOne(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid record');
    }
    return this.textBookModel.findById(id).exec();
  }

  async create(dto: CreateBookDto) {
    const book = new this.textBookModel(dto);
    return book.save();
  }

  async search(query) {
    if (!query) {
      throw new BadRequestException('Query is required');
    }

    return this.textBookModel.find({
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
  }
}

