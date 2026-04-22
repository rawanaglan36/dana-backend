import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateChildDto } from '../dto/create-child.dto';
import { UpdateChildDto } from '../dto/update-child.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Skill } from 'schemas/skill.schema';
import { Model, Types } from 'mongoose';
import { SkillItem } from 'schemas/skill_items.schema';
import { ChildSkill } from 'schemas/child_skill.schema';
import { CreateBulkSkillItemsDto } from '../dto/create-bulk-skill-items.dto';
import { CreateSkillItemDto } from '../dto/create-skill-item.dto';
import { CreateSkillDto } from '../dto/create-skill.dto';
import { GrowthRecord } from 'schemas/growth_record.schema';
import { CreateGrowthDto } from '../dto/create-growth.dto';
import { Child } from 'schemas/child.schema';
import { Vaccine } from 'schemas/vaccine.schema';
import { ChildVaccination } from 'schemas/child-vaccination.schema';
import { TakeVaccineDto } from '../dto/take-vaccine.dto';
import { CreateVaccineDto } from '../dto/create-vaccine.dto';
import { responseDto } from 'src/response.dto';


@Injectable()
export class childVaccinationsService {
    constructor(
        @InjectModel(Skill.name) private skillModel: Model<Skill>,
        @InjectModel(SkillItem.name) private skillItemModel: Model<SkillItem>,
        @InjectModel(ChildSkill.name) private childSkillModel: Model<ChildSkill>,
        @InjectModel(GrowthRecord.name) private growthModel: Model<GrowthRecord>,
        @InjectModel(Child.name) private childModel: Model<Child>,
        @InjectModel(Vaccine.name) private vaccineModel: Model<Vaccine>,
        @InjectModel(ChildVaccination.name) private childVaccinationModel: Model<ChildVaccination>,
    ) { }


    private calculateDueDate(
        birthDate: Date,
        value: number,
        unit: string,
    ): Date {
        const dueDate = new Date(birthDate);

        switch (unit) {
            case 'hours':
                dueDate.setHours(dueDate.getHours() + value);
                break;

            case 'days':
                dueDate.setDate(dueDate.getDate() + value);
                break;

            case 'weeks':
                dueDate.setDate(dueDate.getDate() + value * 7);
                break;

            case 'months':
                dueDate.setMonth(dueDate.getMonth() + value);
                break;
        }

        return dueDate;
    }


    //admin

    async generateSchedule(childId: string) {
        const child = await this.childModel.findById(childId);
        if (!child) throw new NotFoundException('Child not found');

        const vaccines = await this.vaccineModel.find();

        const schedules = vaccines.map((vaccine) => {

            const dueDate = this.calculateDueDate(
                child.birthDate,
                vaccine.scheduleValue,
                vaccine.scheduleUnit,
            );

            return {
                childId,
                vaccineId: vaccine._id,
                dueDate,
                status: 'pending',
            };
        });

        await this.childVaccinationModel.insertMany(schedules);

        return { response: new responseDto(200, 'Vaccination schedule created') };
    }

    //bring Vaccinations
    //update status automatic
    async getChildVaccinations(childId: string) {
        const records = await this.childVaccinationModel
            .find({ childId })
            .populate('vaccineId')
            .sort({ dueDate: 1 });

        const today = new Date();

        const results = records.map((rec) => {
            let status = rec.status;

            if (!rec.takenDate && rec.dueDate < today) {
                status = 'missed';
            }

            return {
                id: rec._id,
                vaccine: rec.vaccineId,
                dueDate: rec.dueDate,
                takenDate: rec.takenDate,
                status,
            };
        });
        
        return { response: new responseDto(200, 'success', results) };
    }

    // vaccine is taken 
    async takeVaccine(childVaccinationId: string, dto: TakeVaccineDto) {

        if (!Types.ObjectId.isValid(childVaccinationId)) {
            throw new BadRequestException('Invalid record');
        }

        const record = await this.childVaccinationModel.findById(childVaccinationId);
        if (!record) throw new NotFoundException('Record not found');

        let takenDate: Date = new Date();
        // if (dto.takenDate) {
        // if (!dto) {
        //   takenDate = new Date();
        // }

        takenDate = new Date(dto.takenDate);
        if (takenDate > new Date()) {
            throw new BadRequestException("Taken date cannot be in the future");
        }
        // }else{
        // }

        record.takenDate = takenDate;
        record.status = 'taken';
        record.notes = dto.notes;

        await record.save();

        return { response: new responseDto(200, 'Vaccine marked as taken') };
    }


}