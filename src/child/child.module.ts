import { Module } from '@nestjs/common';
import { ChildService } from './services/child.service';
import { ChildController } from './controllers/child.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Skill, SkillSchema } from 'schemas/skill.schema';
import { SkillItem, SkillItemSchema } from 'schemas/skill_items.schema';
import { ChildSkill, ChildSkillSchema } from 'schemas/child_skill.schema';
import { GrowthRecord, GrowthRecordSchema } from 'schemas/growth_record.schema';
import { Child, ChildSchema } from 'schemas/child.schema';
import { Vaccine, VaccineSchema } from 'schemas/vaccine.schema';
import { ChildVaccination, ChildVaccinationSchema } from 'schemas/child-vaccination.schema';
import { SkillsController } from './controllers/skills.controller';
import { ChildGrowthController } from './controllers/child-growth.controller';
import { ChildVaccinationsController } from './controllers/child-vaccinations.controller';
import { VaccinationsController } from './controllers/vaccinations.controller';
import { ChildRecordController } from './controllers/child-record.controller';
import { skillsService } from './services/skills.service';
import { childGrowthService } from './services/child-growth.service';
import { childVaccinationsService } from './services/child-vaccinations.service';
import { vaccinationsService } from './services/vaccinations.service';
import { ChildRecordService } from './services/child-record.service';
import { ChildRecord, ChildRecordSchema } from 'schemas/child-record.schema';
import { Book, BookSchema } from 'schemas/booking.schema';
import { UploadModule } from 'src/upload-file/upload-file.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Skill.name, schema: SkillSchema }]),
    MongooseModule.forFeature([{ name: SkillItem.name, schema: SkillItemSchema }]),
    MongooseModule.forFeature([{ name: ChildSkill.name, schema: ChildSkillSchema }]),
    MongooseModule.forFeature([{ name: GrowthRecord.name, schema: GrowthRecordSchema }]),
    MongooseModule.forFeature([{ name: Child.name, schema: ChildSchema }]),
    MongooseModule.forFeature([{ name: Vaccine.name, schema: VaccineSchema }]),
    MongooseModule.forFeature([{ name: ChildVaccination.name, schema: ChildVaccinationSchema }]),
    MongooseModule.forFeature([{ name: ChildRecord.name, schema: ChildRecordSchema }]),
    MongooseModule.forFeature([{ name: Book.name, schema: BookSchema }]),
    UploadModule

  ],
  controllers: [ChildController,SkillsController,ChildGrowthController,ChildVaccinationsController,VaccinationsController,ChildRecordController],
  providers: [ChildService,skillsService,childGrowthService,childVaccinationsService,vaccinationsService,ChildRecordService],
  exports: [ChildService,skillsService,childGrowthService,childVaccinationsService,vaccinationsService,ChildRecordService],
})
export class ChildModule { }
