import { Module } from '@nestjs/common';
import { TextBooksService } from './textBooks.service';
import { TextBooksController } from './textBooks.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Book, BookSchema } from 'schemas/booking.schema';
import { TextBook, TextBooksSchema } from 'schemas/textBooks.schema';
import { BookSeeder } from './seeders/textBook.seeder';

@Module({
  imports: [MongooseModule.forFeature([{ name: TextBook.name, schema: TextBooksSchema }])],
  controllers: [TextBooksController],
  providers: [TextBooksService, BookSeeder],
})
export class TextBooksModule { }
