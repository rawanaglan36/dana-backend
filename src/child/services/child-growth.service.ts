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
export class childGrowthService {
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



    async addGrowth(childId: string, dto: CreateGrowthDto) {
        const child = await this.childModel.findById(childId);
        if (!child) throw new NotFoundException('Child not found');


        //  create growth record
        const record = await this.growthModel.create({
            childId,
            ...dto,
        });

        //  update current values (Optimization )
        await this.childModel.findByIdAndUpdate(childId, {
            currentHeight: dto.height,
            currentWeight: dto.weight,
            currentHeadCircumference: dto.headCircumference,
        });

        return { response: new responseDto(200, 'success', record) };
    }

    //  bring  growth history
    async getGrowthHistory(childId: string) {
        const history = await this.growthModel
            .find({ childId })
            .sort({ recordDate: 1 }); // ASC
        return { response: new responseDto(200, 'success', history) };
    }

    //  bring newst growht schaduale
    async getLatestGrowth(childId: string) {
        const latest = await this.growthModel
            .findOne({ childId })
            .sort({ recordDate: -1 });
        return { response: new responseDto(200, 'success', latest) };
    }

    //   current state in summary
    async getCurrentStats(childId: string) {
        const child = await this.childModel.findById(childId);

        if (!child) throw new NotFoundException('Child not found');

        return { response: new responseDto(200, 'success', {
            height: child.currentHeight,
            weight: child.currentWeight,
            headCircumference: child.currentHeadCircumference,
        }) };
    }


}