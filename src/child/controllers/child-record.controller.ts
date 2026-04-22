import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/parent/guard/auth.guard';
import { responseDto } from 'src/response.dto';
import { ChildRecordService } from '../services/child-record.service';
import { ChildIdParamDto } from '../dto/child-id-param.dto';
import { CreateChildRecordDto } from '../dto/create-child-record.dto';
import { UpdateChildRecordDto } from '../dto/update-child-record.dto';

@Controller('v1/child-record')
export class ChildRecordController {
  constructor(private readonly childRecordService: ChildRecordService) { }

  // @UseGuards(AuthGuard)
  @Post('generate/:childId')
  async generate(@Param() params: ChildIdParamDto) {
    return await this.childRecordService.generate(params.childId) ;
  }

  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() body: CreateChildRecordDto) {
    return await this.childRecordService.generate(body.childId) ;
  }

  @UseGuards(AuthGuard)
  @Get()
  async findAll() {
    return await this.childRecordService.findAll() ;
  }

  @UseGuards(AuthGuard)
  @Get('child/:childId')
  async findByChild(@Param() params: ChildIdParamDto) {
    return await this.childRecordService.findByChild(params.childId) ;
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.childRecordService.findOne(id) ;
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateChildRecordDto,
  ) {
    return await this.childRecordService.update(id, dto) ;
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.childRecordService.remove(id) ;
  }
}

