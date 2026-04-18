import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { Book, BookSchema } from 'schemas/booking.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Doctor, DoctorSchema } from 'schemas/doctor.schema';
import { Parent, ParentSchema } from 'schemas/parent.schema';
import { PaymobService } from 'src/paymob/paymob.service';
import { DoctorRecord, DoctorRecordSchema } from 'schemas/doctor-record.schema';
import { DoctorRecordService } from './doctor-record.service';
import { DoctorRecordController } from './doctor-record.controller';
import { Child, ChildSchema } from 'schemas/child.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Book.name, schema: BookSchema }]),
    MongooseModule.forFeature([{ name: Doctor.name, schema: DoctorSchema }]),
    MongooseModule.forFeature([{ name: Parent.name, schema: ParentSchema }]),
    MongooseModule.forFeature([{ name: Child.name, schema: ChildSchema }]),
    MongooseModule.forFeature([
      { name: DoctorRecord.name, schema: DoctorRecordSchema },
    ]),
  ],
  controllers: [DoctorRecordController,BookingController],
  providers: [BookingService, PaymobService, DoctorRecordService],
  exports: [BookingService],
})
export class BookingModule {}
