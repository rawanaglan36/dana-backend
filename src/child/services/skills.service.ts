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


@Injectable()
export class skillsService {
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




    async createSkill(dto: CreateSkillDto) {
        const skill = await this.skillModel.create(dto);
        const { __v, _id, ...skillObject } = skill.toObject();
        return skillObject;
    }

    //add skill
    //admin
    async createSkillItem(dto: CreateSkillItemDto) {
        return this.skillItemModel.create(dto);
    }

    //add skill
    //admin
    async createBulkSkillItems(dto: CreateBulkSkillItemsDto) {
        return this.skillItemModel.insertMany(dto.items);
    }

    //bring skills
    async getAllSkills() {
        return this.skillModel.aggregate([
            {
                $lookup: {
                    from: 'skillitems',
                    localField: '_id',
                    foreignField: 'skillId',
                    as: 'items',
                },
            },
            {
                $addFields: {
                    itemCount: { $size: '$items' },
                },
            },
            { $sort: { createdAt: -1 } },
        ]);
    }

    // ==================== دوال العميل (الكلاينت) ====================

    async getSkillsForClient() {
        return this.skillModel.find().select('name').sort({ name: 1 }).exec();
    }

    async getSkillChecklist(childId: string, skillId: string) {

        const items = await this.skillItemModel.find({ skillId });
        const answers = await this.childSkillModel.find({ childId });

        return items.map(item => {
            const found = answers.find(a => a.itemId.toString() === item._id.toString());

            return {
                id: item._id,
                title: item.title,
                checked: found ? found.checked : false
            };
        });


    }

    //check item 
    async toggleItem(childId: string, itemId: string, checked: boolean) {

        const existing = await this.childSkillModel.findOne({
            childId,
            itemId
        });

        if (existing) {
            existing.checked = checked;
            await existing.save();

        } else {
            await this.childSkillModel.create({
                childId,
                itemId,
                checked
            });
        }

        return { message: 'Updated' };
    }


}