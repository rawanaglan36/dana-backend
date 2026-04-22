import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { DoctorPatientsService } from './doctor-patients.service';
import { DoctorIdParamDto } from './dto/doctor-id-param.dto';
import { AuthGuard } from 'src/parent/guard/auth.guard';
import { UpdateDoctorNotificationsDto } from './dto/update-doctor-notfications.dto';
import { UpdateDoctorAppointmentsDto } from './dto/update-doctor-appointments.dto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { AvailableSlotsQueryDto } from './dto/available-slots-query.dto';

@Controller('v1/doctor')
export class DoctorController {
  constructor(
    private readonly doctorService: DoctorService,
    private readonly doctorPatientsService: DoctorPatientsService,
  ) { }

  @Post()
  @UseInterceptors(
    FileInterceptor('file')
  )
  async create(@Body('data') data: string,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [
          new MaxFileSizeValidator({
            maxSize: 5 * 1024 * 1024, // 5 MB PDF
          }),
          new FileTypeValidator({
            fileType: /(pdf|doc|docx)$/i,
          }),

        ],
      }),
    ) file?: Express.Multer.File) {


    let parsed: CreateDoctorDto | null = null;
    if (data && data !== "undefined") {
      try {
        parsed = JSON.parse(data);
      } catch (error) {
        throw new BadRequestException("Invalid JSON in 'data'");
      }
    }

    if (!parsed) {
      throw new BadRequestException("'data' field is required");
    }
    const body = plainToInstance(CreateDoctorDto, parsed);

    const errors = await validate(body);
    if (errors.length > 0) {
      const messages = errors.map(e => Object.values(e.constraints || {}).join(', '));
      throw new BadRequestException(messages);
    }

    return this.doctorService.create(body, file);
  }

  @Get()
  async findAll() {
    return this.doctorService.findAll();
  }

  // @UseGuards(AuthGuard)
  @Post(':id/patients/generate')
  async generateDoctorPatients(@Param() params: DoctorIdParamDto) {
    return this.doctorPatientsService.generate(params.id);
  }

  // @UseGuards(AuthGuard)
  @Get(':id/patients')
  async getDoctorPatients(@Param() params: DoctorIdParamDto) {
    return this.doctorPatientsService.getDoctorPatients(params.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.doctorService.findOne(id);
  }

  @Get(':id/available-slots')
  async getAvailableSlots(
    @Param() params: DoctorIdParamDto,
    @Query() query: AvailableSlotsQueryDto,
  ) {
    return this.doctorService.getAvailableSlots(params.id, query.date);
  }

  @Patch(':id/profile')
  @UseInterceptors(FileInterceptor('file'))
  async update(@Param('id') id: string,
    @Body('data') data: string,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [
          new MaxFileSizeValidator({
            maxSize: 100000, // 100 KB
          }),
          new FileTypeValidator({
            fileType: /(jpg|jpeg|png)$/i,
          }),

        ],
      }),
    ) file?: Express.Multer.File
  ) {
    let parsed: UpdateDoctorDto | null = null;
    if (data && data !== "undefined") {
      try {
        parsed = JSON.parse(data);
      } catch (error) {
        throw new BadRequestException("Invalid JSON in 'data'");
      }
    }

    if (!parsed) {
      throw new BadRequestException("'data' field is required");
    }
    const body = plainToInstance(UpdateDoctorDto, parsed);

    const errors = await validate(body);
    if (errors.length > 0) {
      const messages = errors.map(e => Object.values(e.constraints || {}).join(', '));
      throw new BadRequestException(messages);
    }


    return this.doctorService.update(id, body, file);
  }
  // @Patch(':id')
  // async update(
  //   @Param('id') id: string,
  //   @Body() updateDoctorDto: UpdateDoctorDto,
  // ) {
  //   return this.doctorService.update(id, updateDoctorDto);
  // }


  @Patch(':id/appointments')
  async updateAppointments(
    @Param('id') id: string,
    @Body() updateDoctorAppointmentsDto: UpdateDoctorAppointmentsDto,
  ) {
    return this.doctorService.updateAppointments(id, updateDoctorAppointmentsDto);
  }


  @Patch(':id/notifications')
  async updateNotifications(
    @Param('id') id: string,
    @Body() updateDoctorNotificationsDto: UpdateDoctorNotificationsDto,
  ) {
    return this.doctorService.updateNotifications(id, updateDoctorNotificationsDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.doctorService.remove(id);
  }

  @Patch('/:doctorId/child/:childId/compelete-consultation')
  async confirm(@Param('childId') childId: string,
    @Param('doctorId') doctorId: string) {
    return this.doctorService.confirm(childId, doctorId);
  }
}
