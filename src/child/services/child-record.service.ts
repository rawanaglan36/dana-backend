import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { responseDto } from 'src/response.dto';
import { Child } from 'schemas/child.schema';
import { GrowthRecord } from 'schemas/growth_record.schema';
import { ChildVaccination } from 'schemas/child-vaccination.schema';
import { ChildRecord } from 'schemas/child-record.schema';
import { Book } from 'schemas/booking.schema';
import { UpdateChildRecordDto } from '../dto/update-child-record.dto';

@Injectable()
export class ChildRecordService {
  constructor(
    @InjectModel(Child.name) private childModel: Model<Child>,
    @InjectModel(GrowthRecord.name) private growthModel: Model<GrowthRecord>,
    @InjectModel(ChildVaccination.name) private childVaccinationModel: Model<ChildVaccination>,
    @InjectModel(ChildRecord.name) private childRecordModel: Model<ChildRecord>,
    @InjectModel(Book.name) private bookModel: Model<Book>,
  ) { }

  private getTodayStart(): Date {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  }

  private childIdMatch(childId: string) {
    const oid = new Types.ObjectId(childId);
    return { childId: { $in: [childId, oid] as any } };
  }

  private padMonth(m: number): string {
    return m < 10 ? `0${m}` : `${m}`;
  }

  /** Bookings for this child in the given calendar month (date string yyyy-mm-dd). */
  private async countBookingsInMonth(
    childId: string,
    year: number,
    month: number,
  ): Promise<number> {
    const prefix = `${year}-${this.padMonth(month)}`;
    return this.bookModel.countDocuments({
      ...this.childIdMatch(childId),
      date: new RegExp(`^${prefix}`),
    });
  }

  /** One count per month (1–12) for this child in the given year. */
  private async buildMonthlyOverview(
    childId: string,
    year: number,
  ): Promise<{ month: number; year: number; count: number }[]> {
    const overview: { month: number; year: number; count: number }[] = [];
    for (let m = 1; m <= 12; m++) {
      const count = await this.countBookingsInMonth(childId, year, m);
      overview.push({ month: m, year, count });
    }
    return overview;
  }

  async generate(childId: string) {
    if (!Types.ObjectId.isValid(childId)) {
      throw new BadRequestException('invalid input');
    }

    const child = await this.childModel.findById(childId);
    if (!child) {
      throw new NotFoundException('Child not found');
    }

    const growthHistory = await this.growthModel
      .find({ childId })
      .sort({ recordDate: 1 });

    const latestGrowth = await this.growthModel
      .findOne({ childId })
      .sort({ recordDate: -1 });

    const currentStats = {
      height: child.currentHeight,
      weight: child.currentWeight,
      headCircumference: child.currentHeadCircumference,
    };

    const vaccinations = await this.childVaccinationModel
      .find({ childId })
      .populate('vaccineId')
      .sort({ dueDate: 1 });

    const recordDate = this.getTodayStart();
    if (await this.childRecordModel.findOne({ childId: new Types.ObjectId(childId), recordDate })) {
      throw new BadRequestException('Record already exists');
    }

    const totalActivePatients = await this.childModel.countDocuments({
      isActive: true,
    });

    const year = recordDate.getFullYear();
    const month = recordDate.getMonth() + 1;
    const monthlyPerformance = await this.countBookingsInMonth(childId, year, month);
    const monthlyOverview = await this.buildMonthlyOverview(childId, year);

    const record = await this.childRecordModel.findOneAndUpdate(
      { childId: new Types.ObjectId(childId), recordDate },
      {$set: {
        childId: new Types.ObjectId(childId),
        recordDate,
        childData: child,
        growthHistory,
        latestGrowth,
        currentStats,
        vaccinations,
        totalActivePatients,
        monthlyPerformance,
        monthlyOverview,
      }},
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    return new responseDto(200, 'success', record);
  }

  async findAll() {
    const records = await this.childRecordModel
      .find()
      .sort({ recordDate: -1 })
      .populate('childId', 'childName birthDate parentId');
    return new responseDto(200, 'success', records);
  }

  async findOne(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('invalid input');
    }
    const record = await this.childRecordModel.findById(id);
    if (!record) {
      throw new NotFoundException();
    }
    return new responseDto(200, 'success', record);
  }

  async findByChild(childId: string) {
    if (!Types.ObjectId.isValid(childId)) {
      throw new BadRequestException('invalid input');
    }
    const records = await this.childRecordModel
      .find({ childId: new Types.ObjectId(childId) })
      .sort({ recordDate: -1 });
    return new responseDto(200, 'success', records);
  }

  async update(id: string, dto: UpdateChildRecordDto) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('invalid input');
    }
    const updated = await this.childRecordModel.findByIdAndUpdate(id, dto, { new: true });
    if (!updated) {
      throw new NotFoundException();
    }
    return new responseDto(200, 'success', updated);
  }

  async remove(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('invalid input');
    }
    const deleted = await this.childRecordModel.findByIdAndDelete(id);
    if (!deleted) {
      throw new NotFoundException();
    }
    return new responseDto(200, 'success', deleted);
  }
}

