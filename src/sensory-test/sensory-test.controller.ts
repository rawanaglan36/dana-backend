import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SensoryTestService } from './sensory-test.service';
import { CreateSensoryTestDto } from './dto/create-sensory-test.dto';
import { UpdateSensoryTestDto } from './dto/update-sensory-test.dto';
import { CreateQuestionDto } from './dto/question.dto';

@Controller('v1/sensory-test')
export class SensoryTestController {
  constructor(private readonly sensoryTestService: SensoryTestService) { }


  //Admin
  @Post('')
  createBulkQuestions(
    @Body() questions: CreateQuestionDto[],
  ) {
    return this.sensoryTestService.createBulkQuestions(questions);
  }


  @Get('')
  findAllQuestions() {
    return this.sensoryTestService.findAllQuestions();
  }

  @Post(':childId')
  createTestModel(
    @Param('childId') childId: string,
    @Body() dto: CreateSensoryTestDto,
  ) {
    return this.sensoryTestService.createTestModel(childId, dto);
  }
}
