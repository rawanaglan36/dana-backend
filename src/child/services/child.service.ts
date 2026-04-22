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
export class ChildService {
  constructor(
    @InjectModel(Skill.name) private skillModel: Model<Skill>,
    @InjectModel(SkillItem.name) private skillItemModel: Model<SkillItem>,
    @InjectModel(ChildSkill.name) private childSkillModel: Model<ChildSkill>,
    @InjectModel(GrowthRecord.name) private growthModel: Model<GrowthRecord>,
    @InjectModel(Child.name) private childModel: Model<Child>,
    @InjectModel(Vaccine.name) private vaccineModel: Model<Vaccine>,
    @InjectModel(ChildVaccination.name) private childVaccinationModel: Model<ChildVaccination>,
  ) { }



  async create(createChildDto: CreateChildDto) {
    const child = new this.childModel(createChildDto);
    const savedChild = await child.save();
    return { response: new responseDto(200, 'success', savedChild) };
  }

  async findAll() {
    const children = await this.childModel.find().exec();
    return { response: new responseDto(200, 'success', children) };
  }

  async findOne(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('invalid input');
    }
    const child = await this.childModel.findById(id).exec();
    if (!child) {
      throw new NotFoundException();
    }
    return { response: new responseDto(200, 'success', child) };
  }

  async update(id: string, updateChildDto: UpdateChildDto) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('invalid input');
    }
    const child = await this.childModel.findByIdAndUpdate(id, updateChildDto, { new: true }).exec();
    if (!child) {
      throw new NotFoundException();
    }
    return { response: new responseDto(200, 'success', child) };
  }

  async remove(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('invalid input');
    }
    const child = await this.childModel.findByIdAndDelete(id).exec();
    if (!child) {
      throw new NotFoundException();
    }
    return { response: new responseDto(200, 'success', child) };
  }



  //create vaccine admin 

  //create vaccine admin 





}
