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

@Controller('v1/child/:id/growth')
export class ChildGrowthController {
    constructor(
        private readonly childService: ChildService,
        private readonly skillsService: skillsService,
        private readonly vaccinationsService: vaccinationsService,
        private readonly childVaccinationsService: childVaccinationsService,
        private readonly childGrowthService: childGrowthService,

    ) { }

    //child-growth

    @Post('')
    addGrowth(
        @Param('id') childId: string,
        @Body() dto: CreateGrowthDto,
    ) {
        return this.childGrowthService.addGrowth(childId, dto);
    }

    //  history
    @Get('')
    getHistory(@Param('id') childId: string) {
        return this.childGrowthService.getGrowthHistory(childId);
    }

    //  latest
    @Get('latest')
    getLatest(@Param('id') childId: string) {
        return this.childGrowthService.getLatestGrowth(childId);
    }

    //  current (fast)
    @Get('current')
    getCurrent(@Param('id') childId: string) {
        return this.childGrowthService.getCurrentStats(childId);
    }

    //child-growth

}