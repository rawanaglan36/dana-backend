import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { responseDto } from 'src/response.dto';
import { Book } from 'schemas/booking.schema';
import { Child } from 'schemas/child.schema';
import { DoctorPatientRecord } from 'schemas/doctor-patient-record.schema';
import { Doctor } from 'schemas/doctor.schema';
import { ChildRecord } from 'schemas/child-record.schema';

@Injectable()
export class DoctorPatientsService {
  constructor(
    @InjectModel(Doctor.name) private doctorModel: Model<Doctor>,
    @InjectModel(Book.name) private bookModel: Model<Book>,
    @InjectModel(Child.name) private childModel: Model<Child>,
    @InjectModel(ChildRecord.name) private childRecordModel: Model<ChildRecord>,
    @InjectModel(DoctorPatientRecord.name)
    private doctorPatientRecordModel: Model<DoctorPatientRecord>,
  ) { }

  private getDateMinusDays(days: number): Date {
    const d = new Date();
    d.setDate(d.getDate() - days);
    return d;
  }

  async getDoctorPatients(doctorId: string) {
    if (!Types.ObjectId.isValid(doctorId)) {
      throw new BadRequestException('invalid input');
    }

    const doctorObjectId = new Types.ObjectId(doctorId);

    const latestByPatient = await this.bookModel.aggregate([
      { $match: { doctorId: doctorObjectId } },
      { $sort: { date: -1, time: -1 } },
      {
        $group: {
          _id: '$childId',
          lastBookingId: { $first: '$_id' },
          lastVisitDate: { $first: '$date' },
          lastVisitTime: { $first: '$time' },
        },
      },
    ]);

    const patientIds = latestByPatient.map((x) => x._id);
    const children = await this.childModel
      .find({ _id: { $in: patientIds } })
      .select('childName');

    const childNameMap = new Map<string, string>();
    children.forEach((c: any) => childNameMap.set(String(c._id), c.childName));

    const sevenDaysAgo = this.getDateMinusDays(7);

    const recordsToUpsert = latestByPatient.map((p) => {
      const name = childNameMap.get(String(p._id)) || '';
      const activeThisWeek = new Date(p.lastVisitDate) >= sevenDaysAgo;
      return {
        doctorId: doctorObjectId,
        patientId: p._id,
        patientName: name,
        lastVisitBookingId: p.lastBookingId,
        lastVisitDate: p.lastVisitDate,
        lastVisitTime: p.lastVisitTime,
        // activeThisWeek,
      };
    });

    for (const rec of recordsToUpsert) {
      if (!rec.patientName) continue;
      await this.doctorPatientRecordModel.findOneAndUpdate(
        { doctorId: rec.doctorId, patientId: rec.patientId },
        {
          $set: {
            patientName: rec.patientName,
            lastVisitBookingId: rec.lastVisitBookingId,
            lastVisitDate: rec.lastVisitDate,
            lastVisitTime: rec.lastVisitTime,
            // activeThisWeek: rec.activeThisWeek,
          },
          $setOnInsert: {
            doctorId: rec.doctorId,
            patientId: rec.patientId,
          },
        },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );
    }

    const patients = recordsToUpsert
      .filter((r) => r.patientName)
      .map((r) => ({
        name: r.patientName,
        fileId: String(r.patientId), // fileID meaning is UNKNOWN; using patientId
        lastVisit: {
          bookingId: String(r.lastVisitBookingId),
          date: r.lastVisitDate,
          time: r.lastVisitTime,
        },
      }));

    return new responseDto(200, 'success', {
      totalPatients: patients.length,
      patients,
    });
  }




  private mapBookingStatus(status: string): 'canceled' | 'pending' | 'completed' {
    if (status === 'cancelled') return 'canceled';
    if (status === 'confirmed') return 'completed';
    return 'pending';
  }

  private isWithinLastDays(dateStr: string, days: number): boolean {
    const d = new Date(dateStr);
    return d >= this.getDateMinusDays(days);
  }

  async generate(doctorId: string) {
    if (!Types.ObjectId.isValid(doctorId)) {
      throw new BadRequestException('invalid input');
    }

    const doctorObjectId = new Types.ObjectId(doctorId);

    const bookings = await this.bookModel
      .find({
        doctorId: { $in: [doctorId, doctorObjectId] as any },
      })
      .sort({ date: -1, time: -1 });

    const latestByPatient = new Map<
      string,
      { childId: any; lastBooking: any }
    >();

    const pendingByPatientLatestDate = new Map<string, string>();

    for (const b of bookings as any[]) {
      const childKey = String(b.childId);

      if (!latestByPatient.has(childKey)) {
        latestByPatient.set(childKey, { childId: b.childId, lastBooking: b });
      }

      if (b.status === 'pending') {
        const existing = pendingByPatientLatestDate.get(childKey);
        if (!existing || String(b.date) > existing) {
          pendingByPatientLatestDate.set(childKey, String(b.date));
        }
      }
    }

    const patientKeys = Array.from(latestByPatient.keys());
    const patientObjectIds = patientKeys
      .filter((id) => Types.ObjectId.isValid(id))
      .map((id) => new Types.ObjectId(id));

    const children = await this.childModel
      .find({ _id: { $in: patientObjectIds } })
      .select('childName age isActive');

    const childMap = new Map<string, any>();
    children.forEach((c: any) => childMap.set(String(c._id), c));

    const latestChildRecord = await this.childRecordModel.aggregate([
      { $match: { childId: { $in: patientObjectIds } } },
      { $sort: { recordDate: -1 } },
      {
        $group: {
          _id: '$childId',
          childRecordId: { $first: '$_id' },
        },
      },
    ]);

    const childRecordMap = new Map<string, Types.ObjectId>();
    latestChildRecord.forEach((r: any) =>
      childRecordMap.set(String(r._id), r.childRecordId),
    );

    const patients: any[] = [];
    const needsAttention: any[] = [];
    const activeThisWeek: any[] = [];

    for (const key of patientKeys) {
      const child = childMap.get(String(key));
      if (!child) continue;

      const last = latestByPatient.get(key)!.lastBooking;
      const bookingStatus = this.mapBookingStatus(String(last.status));
      const childRecordId = childRecordMap.get(String(key));

      const needsAttentionFlag = bookingStatus === 'pending';
      const pendingDate = pendingByPatientLatestDate.get(key);
      const activeThisWeekFlag =
        !!pendingDate && this.isWithinLastDays(pendingDate, 7) && needsAttentionFlag;

      const row = {
        childName: child.childName,
        childRecordID: childRecordId ? String(childRecordId) : null,
        age: child.age,
        lastBookingDate: String(last.date),
        status: child.isActive === true,
        bookingStatus,
      };

      patients.push(row);
      if (needsAttentionFlag) needsAttention.push(row);
      if (activeThisWeekFlag) activeThisWeek.push(row);

      await this.doctorPatientRecordModel.findOneAndUpdate(
        { doctorId: doctorObjectId, patientId: new Types.ObjectId(key) },
        {
          $set: {
            patientName: child.childName,
            childRecordId: childRecordId,
            age: child.age,
            lastVisitBookingId: last._id,
            lastVisitDate: String(last.date),
            lastVisitTime: String(last.time),
            bookingStatus,
            isActive: child.isActive,
            needsAttention: needsAttentionFlag,
            activeThisWeek: activeThisWeekFlag,
          },
          $setOnInsert: {
            doctorId: doctorObjectId,
            patientId: new Types.ObjectId(key),
          },
        },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );
    }

    return new responseDto(200, 'success', {
      totalPatients: patients.length,
      patients,
      needsAttention: {
        total: needsAttention.length,
        patients: needsAttention,
      },
      activeThisWeek: {
        total: activeThisWeek.length,
        patients: activeThisWeek,
      },
    });
  }

}