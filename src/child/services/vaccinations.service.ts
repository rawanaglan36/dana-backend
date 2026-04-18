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
export class vaccinationsService {
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



    async createVaccine(dto: CreateVaccineDto) {
        try {
            const vaccine = await this.vaccineModel.create(dto);
            return vaccine;
        } catch (err) {
            throw new BadRequestException('Vaccine already exists');
        }
    }

    // groub of vaccine 
    async createBulkVaccine(vaccines: CreateVaccineDto[]) {
        try {
            const result = await this.vaccineModel.insertMany(vaccines, {
                ordered: false, //  continue even there is duplicate
            });

            return {
                message: 'Vaccines inserted',
                count: result.length,
            };
        } catch (err) {
            throw new BadRequestException('Error inserting vaccines');
        }
    }

    async findAllVaccines() {
        return this.vaccineModel.find();
    }

}