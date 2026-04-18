import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Doctor } from 'schemas/doctor.schema';
import * as bcrypt from 'bcrypt';
import { responseDto } from 'src/response.dto';
import { CloudinaryService } from 'src/upload-file/upload-file.service';
import { Book } from 'schemas/booking.schema';
import { UpdateDoctorAppointmentsDto } from './dto/update-doctor-appointments.dto';
import { UpdateDoctorNotificationsDto } from './dto/update-doctor-notfications.dto';

@Injectable()
export class DoctorService {
  constructor(
    @InjectModel(Doctor.name) private doctorModel: Model<Doctor>,
    private cloudinaryService: CloudinaryService,
    @InjectModel(Book.name) private bookModel: Model<Book>,
    // private jwt: JwtService,
    // private mailerService: MailerService,
    // private config: ConfigService,
  ) { }
  async create(createDoctorDto: CreateDoctorDto, file?: Express.Multer.File) {
    try {
      const { email, password, phone } = createDoctorDto;
      const doctorEmail = await this.doctorModel.findOne({ email: email });
      const doctorPhone = await this.doctorModel.findOne({ phone: phone });
      if (doctorEmail || doctorPhone) {
        throw new BadRequestException('user already exist');
      }
      //CV
      let cv: string | null = null;
      let cvPublicId: string | null = null;
      if (file) {
        const cvFile = await this.cloudinaryService.uploadFile(file);
        cv = cvFile.secure_url;

        //if not work in client side use this
        // const profileImage=imageFile.url;

        cvPublicId = cvFile.public_id;
      }
      //CV

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      createDoctorDto.password = hashedPassword;
      createDoctorDto.role = 'doctor';
      // const verfictionCode = Math.floor(
      //   100000 + Math.random() * 900000
      // ).toString();

      const doctor = await this.doctorModel.create({ ...createDoctorDto, cv, cvPublicId });
      const doctorObj = doctor.toObject() as any;
      delete doctorObj.password;
      delete doctorObj.__v;
      return new responseDto(200, 'success', doctorObj);
    } catch (error) {
      if (error === 11000) {
        throw new BadRequestException('this date already booked');
      }
      throw error;
    }
  }

  async findAll() {
    try {
      const doctors = await this.doctorModel.find().select('-password -__v');
      return new responseDto(200, 'success', doctors);
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('invalid input');
      }
      const doctor = await this.doctorModel
        .findById(id)
        .select('-password -__v');
      if (!doctor) {
        throw new NotFoundException('doctor not found');
      }
      if (doctor.isActive == false) {
        throw new BadRequestException('doctor is inactive');
      }
      const bookings = await this.bookModel
        .find({ doctorId: id })
        .select('_id childId patientId doctorId date time  status price');
      return new responseDto(200, 'success', { ...doctor.toObject(), bookings });
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, updateDoctorDto: UpdateDoctorDto, file?: Express.Multer.File) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('invalid input');
      }
      const doctor = await this.doctorModel.findById(id);
      if (!doctor) {
        throw new BadRequestException('doctor not found');
      }

      const { email, password, phone } = updateDoctorDto;
      const doctorEmail = await this.doctorModel.findOne({ email: email });
      const doctorPhone = await this.doctorModel.findOne({ phone: phone });
      if (doctorEmail || doctorPhone) {
        throw new BadRequestException('user already exist');
      }

      //profile image
      let profileImage: string | null = null;
      let profileImagePublicId: string | null = null;
      if (file) {
        const imageFile = await this.cloudinaryService.uploadFile(file);
        profileImage = imageFile.secure_url;

        //if not work in client side use this
        // const profileImage=imageFile.url;

        profileImagePublicId = imageFile.public_id;
      }
      //profile image


      // if (updateDoctorDto.isActive) {
      //   return new BadRequestException('cannot update inactive doctor');
      // }

      if (file) {
        updateDoctorDto.profileImage = profileImage as any;
        updateDoctorDto.profileImagePublicId = profileImagePublicId as any;
      }
      const updateDoctor = await this.doctorModel
        .findByIdAndUpdate(id, { ...updateDoctorDto, profileImage, profileImagePublicId }, { new: true })
        .select('-password -__v');
      return new responseDto(200, 'success', updateDoctor);
    } catch (error) {
      throw error;
    }
  }
  async updateAppointments(id: string, updateDoctorAppointmentsDto: UpdateDoctorAppointmentsDto) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('invalid input');
      }
      const doctor = await this.doctorModel.findById(id);
      if (!doctor) {
        throw new BadRequestException('doctor not found');
      }

      const updateDoctor = await this.doctorModel
        .findByIdAndUpdate(id, updateDoctorAppointmentsDto, { new: true })
        .select('-password -__v');
      return new responseDto(200, 'success', updateDoctor);
    } catch (error) {
      throw error;
    }
  }

  async updateNotifications(id: string, updateDoctorNotificationsDto: UpdateDoctorNotificationsDto) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('invalid input');
      }
      const doctor = await this.doctorModel.findById(id);
      if (!doctor) {
        throw new BadRequestException('doctor not found');
      }

      const updateDoctor = await this.doctorModel
        .findByIdAndUpdate(id, updateDoctorNotificationsDto, { new: true })
        .select('-password -__v');
      return new responseDto(200, 'success', updateDoctor);
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string) {
    try {
      const doctor = await this.doctorModel.findById(id);
      if (!doctor) {
        throw new BadRequestException('doctor not found');
      }
      if (!doctor.profileImagePublicId) {
        throw new BadRequestException('doctor profile image not found');
      }
      await this.cloudinaryService.deleteFile(doctor.profileImagePublicId);

      const deleteDoctor = await this.doctorModel
        .findByIdAndUpdate(id, { isActive: false }, { new: true })
        .select('-password -__v');
      return new responseDto(200, 'success', deleteDoctor);
    } catch (error) {
      throw error;
    }
  }

  async confirm(childId: string, doctorId: string) {
    try {
      if (!Types.ObjectId.isValid(childId)) {
        throw new BadRequestException('invalid input');
      }

      const book = await this.bookModel.findOne({ childId, doctorId });
      if (!book) return new NotFoundException('booking not found');

      const updatedBook = await this.bookModel.findByIdAndUpdate(book._id, { status: 'confirmed' }, { new: true });
      return new responseDto(200, 'success', updatedBook);
    } catch (error) {
      throw error;
    }
  }
}
