import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Book } from 'schemas/booking.schema';
import { DoctorRecord } from 'schemas/doctor-record.schema';
import { Child } from 'schemas/child.schema';
import { Model, Types } from 'mongoose';
import { responseDto } from 'src/response.dto';
import { UpdateDoctorRecordDto } from './dto/update-doctor-record.dto';

@Injectable()
export class DoctorRecordService {
  constructor(
    @InjectModel(Book.name) private bookModel: Model<Book>,
    @InjectModel(DoctorRecord.name) private doctorRecordModel: Model<DoctorRecord>,
    @InjectModel(Child.name) private childModel: Model<Child>,
  ) { }

  private getTodayString(): string {
    return new Date().toISOString().slice(0, 10); // yyyy-mm-dd
  }

  private getTodayStart(): Date {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  }

  private padMonth(m: number): string {
    return m < 10 ? `0${m}` : `${m}`;
  }

  /** Bookings for this doctor in the given calendar month (date string yyyy-mm-dd). */
  private async countBookingsInMonth(
    doctorId: string,
    year: number,
    month: number,
  ): Promise<number> {
    const prefix = `${year}-${this.padMonth(month)}`;
    const doctorObjectId = new Types.ObjectId(doctorId);
    return this.bookModel.countDocuments({
      doctorId: { $in: [doctorId, doctorObjectId] as any },
      date: new RegExp(`^${prefix}`),
    });
  }

  /** Last 12 months from the current month, each with its booking count. */
  private async buildMonthlyOverview(
    doctorId: string,
  ): Promise<{ month: number; year: number; count: number }[]> {
    const doctorObjectId = new Types.ObjectId(doctorId);
    const result = await this.bookModel.aggregate([
      { $match: { doctorId: { $in: [doctorId, doctorObjectId] as any } } },
      {
        $addFields: {
          _year: { $toInt: { $substr: ['$date', 0, 4] } },
          _month: { $toInt: { $substr: ['$date', 5, 2] } },
        },
      },
      {
        $group: {
          _id: { year: '$_year', month: '$_month' },
          count: { $sum: 1 },
        },
      },
    ]);

    // Build a map of "year-month" -> count
    const countMap = new Map<string, number>();
    result.forEach((r: any) => {
      countMap.set(`${r._id.year}-${r._id.month}`, r.count);
    });

    // Generate last 12 months from the current month
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    const overview: { month: number; year: number; count: number }[] = [];

    for (let i = 11; i >= 0; i--) {
      let m = currentMonth - i;
      let y = currentYear;
      if (m <= 0) {
        m += 12;
        y -= 1;
      }
      overview.push({ month: m, year: y, count: countMap.get(`${y}-${m}`) || 0 });
    }

    return overview;
  }

  async generateDoctorRecord(doctorId: string) {
    if (!Types.ObjectId.isValid(doctorId)) {
      throw new BadRequestException('invalid input');
    }

    const today = this.getTodayString();

    const todaysAppointmentsCount = await this.bookModel.countDocuments({
      doctorId,
      date: today,
    });

    const statusCounts = await this.bookModel.aggregate([
      {
        $match: {
          doctorId: doctorId,
          // date: { $regex: `^${monthPrefix}` },
        },
      },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const paymentCounts = await this.bookModel.aggregate([
      {
        $match: {
          doctorId: doctorId,
          // date: { $regex: `^${monthPrefix}` },
        },
      },
      { $group: { _id: '$paymentMethod', count: { $sum: 1 } } },
    ]);

    const appointmentStatusCount = { completed: 0, cancelled: 0, pending: 0 };
    const paymentMethodCount = { visa: 0, cash: 0 };

    statusCounts.forEach((item) => {
      if (item._id === 'confirmed') appointmentStatusCount.completed = item.count;
      if (item._id === 'cancelled') appointmentStatusCount.cancelled = item.count;
      if (item._id === 'pending') appointmentStatusCount.pending = item.count;
    });

    paymentCounts.forEach((item) => {
      if (item._id === 'visa') paymentMethodCount.visa = item.count;
      if (item._id === 'on-visit') paymentMethodCount.cash = item.count;
    });

    const recordDate = this.getTodayStart();
    const year = recordDate.getFullYear();
    const month = recordDate.getMonth() + 1;

    // Total Active Patients: count all children (patients of this doctor) with isActive: true
    const doctorObjectId = new Types.ObjectId(doctorId);
    const doctorBookings = await this.bookModel.aggregate([
      { $match: { doctorId: { $in: [doctorId, doctorObjectId] as any } } },
      { $group: { _id: '$childId' } },
    ]);
    const patientIds = doctorBookings.map((b: any) => b._id);
    const totalActivePatients = await this.childModel.countDocuments({
      _id: { $in: patientIds },
      isActive: true,
    });

    // Monthly Performance: count all bookings for this doctor in the current month
    const monthlyPerformance = await this.countBookingsInMonth(doctorId, year, month);

    // Monthly Overview: all bookings for this doctor, grouped by year and month
    const monthlyOverview = await this.buildMonthlyOverview(doctorId);

    try {
      const record = await this.doctorRecordModel.findOneAndUpdate(
        { doctorId: new Types.ObjectId(doctorId), recordDate },
        {
          $set: {
            todaysAppointmentsCount,
            appointmentStatusCount,
            paymentMethodCount,
            totalActivePatients,
            monthlyPerformance,
            monthlyOverview,
          },
          $setOnInsert: { //  only written when a NEW doc is created
            doctorId: new Types.ObjectId(doctorId),
            recordDate,
          },
        },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );

      return { response: new responseDto(200, 'success', { record }) };

    } catch (error) {
      if (error?.code === 11000) { //  race condition: doc was just inserted by a concurrent call
        const record = await this.doctorRecordModel.findOne({
          doctorId: new Types.ObjectId(doctorId),
          recordDate,
        });
        return { response: new responseDto(200, 'success', { record }) };
      }
      throw error;
    }
  }

  async findAll() {
    const records = await this.doctorRecordModel
      .find()
      .sort({ recordDate: -1 })
      .populate('doctorId', 'doctorName detectionPrice profileImage');
    return { response: new responseDto(200, 'success', records) };
  }

  async findOne(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('invalid input');
    }
    const record = await this.doctorRecordModel
      .findById(id)
      .populate('doctorId', 'doctorName detectionPrice profileImage');
    if (!record) {
      throw new NotFoundException();
    }
    return { response: new responseDto(200, 'success', record) };
  }

  async findDoctorRecord(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('invalid input');
    }
    const record = await this.doctorRecordModel
      .find({ doctorId: new Types.ObjectId(id) })
      .sort({ recordDate: -1 })
      .populate('doctorId', 'doctorName detectionPrice profileImage');
    if (!record) {
      throw new NotFoundException();
    }
    return { response: new responseDto(200, 'success', [record]) };
  }

  async update(id: string, updateDto: UpdateDoctorRecordDto) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('invalid input');
    }
    const updated = await this.doctorRecordModel.findByIdAndUpdate(id, updateDto, {
      new: true,
    });
    if (!updated) {
      throw new NotFoundException();
    }
    return { response: new responseDto(200, 'success', updated) };
  }

  async remove(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('invalid input');
    }
    const deleted = await this.doctorRecordModel.findByIdAndDelete(id);
    if (!deleted) {
      throw new NotFoundException();
    }
    return { response: new responseDto(200, 'success', deleted) };
  }
}

