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

@Controller('v1/vaccinations')
export class VaccinationsController {
    constructor(
        private readonly childService: ChildService,
        private readonly skillsService: skillsService,
        private readonly vaccinationsService: vaccinationsService,
        private readonly childVaccinationsService: childVaccinationsService,
    ) { }


    // ADMIN vaccinations
    // one
    @Post('')
    create(@Body() dto: CreateVaccineDto) {
        return this.vaccinationsService.createVaccine(dto);
    }

    // bulk
    @Post('bulk')
    bulk(@Body() dto: createBulkVaccineDto) {
        return this.vaccinationsService.createBulkVaccine(dto.vaccines);
    }

    //  get all
    @Get('')
    findAll() {
        return this.vaccinationsService.findAllVaccines();
    }

}

