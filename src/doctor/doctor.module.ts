import { Module } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { DoctorController } from './doctor.controller';
import { Doctor, DoctorSchema } from 'schemas/doctor.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UploadModule } from 'src/upload-file/upload-file.module';
import { DoctorPatientsService } from './doctor-patients.service';
import { Book, BookSchema } from 'schemas/booking.schema';
import { Child, ChildSchema } from 'schemas/child.schema';
import { DoctorPatientRecord, DoctorPatientRecordSchema } from 'schemas/doctor-patient-record.schema';
import { ChildRecord, ChildRecordSchema } from 'schemas/child-record.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Doctor.name, schema: DoctorSchema }]),
    MongooseModule.forFeature([{ name: Book.name, schema: BookSchema }]),
    MongooseModule.forFeature([{ name: Child.name, schema: ChildSchema }]),
    MongooseModule.forFeature([{ name: ChildRecord.name, schema: ChildRecordSchema }]),
    MongooseModule.forFeature([
      { name: DoctorPatientRecord.name, schema: DoctorPatientRecordSchema },
    ]),
        UploadModule
  ],
  controllers: [DoctorController],
  providers: [DoctorService, DoctorPatientsService],
})
export class DoctorModule {}
