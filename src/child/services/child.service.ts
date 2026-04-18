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



  create(createChildDto: CreateChildDto) {
    return 'This action adds a new child';
  }

  findAll() {
    return `This action returns all child`;
  }

  findOne(id: number) {
    return `This action returns a #${id} child`;
  }

  update(id: number, updateChildDto: UpdateChildDto) {
    return `This action updates a #${id} child`;
  }

  remove(id: number) {
    return `This action removes a #${id} child`;
  }



  //create vaccine admin 

  //create vaccine admin 





}
