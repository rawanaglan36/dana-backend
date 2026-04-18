import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { DoctorRecordService } from './doctor-record.service';
import { DoctorIdParamDto } from './dto/doctor-id-param.dto';
import { CreateDoctorRecordDto } from './dto/create-doctor-record.dto';
import { UpdateDoctorRecordDto } from './dto/update-doctor-record.dto';
import { AuthGuard } from 'src/parent/guard/auth.guard';

@Controller('v1/booking/doctor-record')
export class DoctorRecordController {
  constructor(private readonly doctorRecordService: DoctorRecordService) { }

  // @UseGuards(AuthGuard)
  @Get(':doctorId/analytics')
  async getAnalytics(@Param() params: DoctorIdParamDto) {
    return {
      response: await this.doctorRecordService.generateDoctorRecord(params.doctorId),
    };
  }

  // @UseGuards(AuthGuard)
  @Post()
  async create(@Body() body: CreateDoctorRecordDto) {
    return {
      response: await this.doctorRecordService.generateDoctorRecord(body.doctorId),
    };
  }

  // @UseGuards(AuthGuard)
  @Get()
  async findAll() {
    return {
      response: await this.doctorRecordService.findAll(),
    };
  }

  // @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return {
      response: await this.doctorRecordService.findOne(id),
    };
  }
  // @UseGuards(AuthGuard)
  @Get('doctor/:id')
  async findDoctorRecord(@Param('id') id: string) {
    return this.doctorRecordService.findDoctorRecord(id);
  }

  // @UseGuards(AuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateDto: UpdateDoctorRecordDto) {
    return {
      response: await this.doctorRecordService.update(id, updateDto),
    };
  }

  // @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return {
      response: await this.doctorRecordService.remove(id),
    };
  }
}

