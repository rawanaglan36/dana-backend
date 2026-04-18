import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ChildService } from '../services/child.service';
import { CreateChildDto } from '../dto/create-child.dto';
import { UpdateChildDto } from '../dto/update-child.dto';
import { CreateSkillDto } from '../dto/create-skill.dto';
import { CreateSkillItemDto } from '../dto/create-skill-item.dto';
import { CreateBulkSkillItemsDto } from '../dto/create-bulk-skill-items.dto';
import { ToggleItemDto } from '../dto/toggle-item.dto';
import { CreateGrowthDto } from '../dto/create-growth.dto';
import { TakeVaccineDto } from '../dto/take-vaccine.dto';
import { CreateVaccineDto } from '../dto/create-vaccine.dto';
import { createBulkVaccineDto } from '../dto/create-bulk-vaccine.dto';
import { childVaccinationsService } from '../services/child-vaccinations.service';
import { vaccinationsService } from '../services/vaccinations.service';
import { skillsService } from '../services/skills.service';
import { childGrowthService } from '../services/child-growth.service';

@Controller('v1/child')
export class ChildController {
  constructor(
    private readonly childService: ChildService,
    private readonly skillsService: skillsService,
    private readonly vaccinationsService: vaccinationsService,
    private readonly childVaccinationsService: childVaccinationsService,
  ) { }

  // @Post()
  // createSkill(@Body() createChildDto: CreateChildDto) {
  //   return this.childService.create(createChildDto);
  // }

  // @Get()
  // findAll() {
  //   return this.childService.findAll();
  // }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.childService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChildDto: UpdateChildDto) {
    return this.childService.update(+id, updateChildDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.childService.remove(+id);
  }
}

