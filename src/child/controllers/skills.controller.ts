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

@Controller('v1/skills')
export class SkillsController {
    constructor(
        private readonly childService: ChildService,
        private readonly skillsService: skillsService,
        private readonly vaccinationsService: vaccinationsService,
        private readonly childVaccinationsService: childVaccinationsService,
    ) { }

    @Post()
    // @UseGuards(JwtAuthGuard) // حماية الأدمن
    async createSkill(@Body() dto: CreateSkillDto) {
        return this.skillsService.createSkill(dto);
    }

    @Post('items')
    // @UseGuards(JwtAuthGuard)
    async createSkillItem(@Body() dto: CreateSkillItemDto) {
        return this.skillsService.createSkillItem(dto);
    }

    @Post('items/bulk')
    // @UseGuards(JwtAuthGuard)
    async createBulkItems(@Body() dto: CreateBulkSkillItemsDto) {
        return this.skillsService.createBulkSkillItems(dto);
    }

    @Get()
    async getAllSkills() {
        return this.skillsService.getAllSkills();
    }

    // ====================== Client Routes ======================

    @Get('list')                    // لجلب قائمة المهارات فقط
    async getSkillsList() {
        return this.skillsService.getSkillsForClient();
    }

    @Get(':skillId/child/:childId/checklist')
    async getChecklist(
        @Param('skillId') skillId: string,
        @Param('childId') childId: string,
    ) {
        return this.skillsService.getSkillChecklist(childId, skillId);
    }

    @Post('toggle/child/:childId')
    async toggleItem(@Body() dto: ToggleItemDto, @Param('childId') childId: string) {
        return this.skillsService.toggleItem(childId, dto.itemId, dto.checked);
    }




}

