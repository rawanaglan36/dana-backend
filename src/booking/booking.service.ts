import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { RateBookingDto } from './dto/rate-booking.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Book } from 'schemas/booking.schema';
import { Model } from 'mongoose';
import { Doctor } from 'schemas/doctor.schema';
import { response } from 'express';
import { responseDto } from 'src/response.dto';
import { ENTRY_PROVIDER_WATERMARK } from '@nestjs/common/constants';
import { Parent } from 'schemas/parent.schema';
import { Types } from 'mongoose';
import { Child } from 'schemas/child.schema';

@Injectable()
export class BookingService {
  constructor(
    @InjectModel(Doctor.name) private doctorModel: Model<Doctor>,
    @InjectModel(Book.name) private bookModel: Model<Book>,
    @InjectModel(Parent.name) private parentModel: Model<Parent>,
    @InjectModel(Child.name) private childModel: Model<Child>,
  ) { }

  async create(createBookingDto: CreateBookingDto) {
    // try {

    const doctor = await this.doctorModel
      .findOne({ _id: createBookingDto.doctorId })
      .select('-password -__v');
    const parent = await this.parentModel
      .findOne({ _id: createBookingDto.parentId })
      .select('-password -__v');
    if (!doctor) {
      throw new NotFoundException('doctor not exist');
    }

    if (parent?.isActive == false) {
      throw new BadRequestException('parent is not active');
    }
    if (doctor?.isActive == false) {
      throw new BadRequestException('doctor is not active');
    }
    if (!doctor.avilableDate.includes(createBookingDto.date)) {
      throw new BadRequestException('doctor not avilable this date');
    }
    if (!doctor.avilableTime.includes(createBookingDto.time)) {
      throw new BadRequestException('doctor not avilable this time');
    }
    const exist = await this.bookModel.findOne({
      doctorId: createBookingDto.doctorId,
      date: createBookingDto.date,
      time: createBookingDto.time,
    });
    if (exist) {
      throw new BadRequestException('this date already booked');
    }
    const booking = await this.bookModel.create({
      ...createBookingDto,
      detectionPrice: doctor.detectionPrice,
      paymentStatus: 'pending',
      status: 'pending',
      paymentProvider: 'paymob',
      currency: 'EGP',
      paymobOrderId: '',
      paymobTransactionId: '',
    });

    await this.parentModel.findByIdAndUpdate(createBookingDto.parentId, {
      $addToSet: { bookings: booking._id },
    });

    await this.childModel.findByIdAndUpdate(createBookingDto.childId, {
      $addToSet: { bookings: booking._id },
    });
    await this.doctorModel.findByIdAndUpdate(createBookingDto.doctorId, {
      $addToSet: { bookings: booking._id },
    });

    return new responseDto(200, 'success', booking);

    // } catch (error) {
    //   if (error === 11000) {
    //     throw new BadRequestException('appointmen allready booked')
    //   }
    //   throw new responseDto(500, 'fail to response', error)
    // }
  }
  async markAsPaid(orderId: number, transactionId: number) {
    return this.bookModel.findOneAndUpdate(
      { paymobOrderId: orderId },
      {
        paymentStatus: 'paid',
        // status: 'confirmed',
        paymobTransactionId: transactionId,
      },
    );
  }

  async findAll() {
    try {
      const book = await this.bookModel
        .find()
        .populate('doctorId', 'doctorName detectionPrice profileImage')
        .populate('parentId', 'parentName')
        .populate('childId', 'childName birthDate');
      return new responseDto(200, 'success', book);
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      const book = await this.bookModel.findById(id);
      if (!book) {
        throw new NotFoundException();
      }
      return new responseDto(200, 'success', book);
    } catch (error) {
      throw error;
    }
  }
  async findMyAppointment(id: string) {
    try {
      const books = await this.bookModel.where({
        parentId: id
      });
      if (!books) {
        throw new NotFoundException();
      }
      return new responseDto(200, 'success', books);
    } catch (error) {
      throw error;
    }
  }

  async findDoctorAppointments(doctorId: string) {
    try {
      if (!Types.ObjectId.isValid(doctorId)) {
        throw new BadRequestException('invalid input');
      }

      const books = await this.bookModel
        .find({ doctorId })
        .sort({ date: -1, time: -1 })
        .populate('doctorId', 'doctorName detectionPrice profileImage')
        .populate('parentId', 'parentName')
        .populate('childId', 'childName birthDate age bookings');

      return new responseDto(200, 'success', books);
    } catch (error) {
      throw error;
    }
  }

  private getTodayString(): string {
    return new Date().toISOString().slice(0, 10); // yyyy-mm-dd
  }

  async findDoctorAppointmentsToday(doctorId: string) {
    try {
      if (!Types.ObjectId.isValid(doctorId)) {
        throw new BadRequestException('invalid input');
      }
      const today = this.getTodayString();

      const todaysAppointments = await this.bookModel.find({ doctorId, date: today }) .sort({ time: 1 }) .populate('doctorId', 'doctorName detectionPrice profileImage') .populate('parentId', 'parentName') .populate('childId', 'childName birthDate');

      return new responseDto(200, 'success', todaysAppointments);
    } catch (error) {
      throw error;
    }
  }


  async update(id: string, updateBookingDto: UpdateBookingDto) {
    try {

      const doctor = await this.doctorModel
        .findOne({ _id: updateBookingDto.doctorId })
        .select('-password -__v');
      const parent = await this.parentModel
        .findOne({ _id: updateBookingDto.parentId })
        .select('-password -__v');
      if (!doctor) {
        throw new NotFoundException('doctor not exist');
      }

      if (parent?.isActive == false) {
        throw new BadRequestException('parent is not active');
      }
      if (doctor?.isActive == false) {
        throw new BadRequestException('doctor is not active');
      }
      if (!doctor.avilableDate.includes(updateBookingDto.date)) {
        throw new BadRequestException('doctor not avilable this date');
      }
      if (!doctor.avilableTime.includes(updateBookingDto.time)) {
        throw new BadRequestException('doctor not avilable this time');
      }
      const existing = await this.bookModel.findOne({
        doctorId:updateBookingDto.doctorId,
        date:updateBookingDto.date,
        time:updateBookingDto.time,
      });

      if (existing) {
        throw new BadRequestException('Slot already booked');
      }
      const updatedBook = await this.bookModel.findByIdAndUpdate(id, {
        date: updateBookingDto.date,
        time: updateBookingDto.time,
      }, { new: true });
      // const updatedBook = await this.bookModel.findByIdAndUpdate(id, updateBookingDto, { new: true })
      return new responseDto(200, 'success', updatedBook);
    } catch (error) {
      return new responseDto(500, 'fail to response', error)
    }
  }


  async remove(id: string) {
    try {
      const book = await this.bookModel.findById(id);
      if (!book) return new NotFoundException();
      const updatedBook = await this.bookModel.findByIdAndDelete(id);
      return new responseDto(200, 'success', updatedBook);
    } catch (error) {
      throw error;
    }
  }
  async cancel(childId: string) {
    try {
      if (!Types.ObjectId.isValid(childId)) {
        throw new BadRequestException('invalid input');
      }
      const book = await this.bookModel.findOne({ childId });
      if (!book) return new NotFoundException();
      const updatedBook = await this.bookModel.findByIdAndUpdate(book._id, { status: 'cancelled' });
      return new responseDto(200, 'success', updatedBook);
    } catch (error) {
      throw error;
    }
  }

  async rateBooking(id: string, rateBookingDto: RateBookingDto) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('invalid booking id');
      }

      const booking = await this.bookModel.findById(id);
      if (!booking) {
        throw new NotFoundException('booking not found');
      }

      if (booking.status !== 'confirmed') {
        throw new BadRequestException('You can rate the booking only when it is confirmed');
      }

      const doctor = await this.doctorModel.findById(booking.doctorId);
      if (!doctor) {
        throw new NotFoundException('doctor not found');
      }

      const oldRating = booking.rating || 0;
      const newRating = rateBookingDto.rating;

      let ratingQuantity = doctor.ratingQuantity || 0;
      let ratingAverage = doctor.ratingAverage || 0;

      if (oldRating === 0) {
        // New rating
        const totalRating = (ratingAverage * ratingQuantity) + newRating;
        ratingQuantity += 1;
        ratingAverage = totalRating / ratingQuantity;
      } else {
        // Update existing rating
        const totalRating = (ratingAverage * ratingQuantity) - oldRating + newRating;
        ratingAverage = totalRating / ratingQuantity;
      }

      await this.doctorModel.findByIdAndUpdate(booking.doctorId, {
        ratingAverage,
        ratingQuantity,
      });

      booking.rating = newRating;
      await booking.save();

      return new responseDto(200, 'success', booking);
    } catch (error) {
      throw error;
    }
  }
}
