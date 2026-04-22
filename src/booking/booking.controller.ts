import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { RateBookingDto } from './dto/rate-booking.dto';
import { PaymobService } from '../paymob/paymob.service';
import { ParentService } from '../parent/parent.service';
import { InjectModel } from '@nestjs/mongoose';
import { Parent } from 'schemas/parent.schema';
import { Model } from 'mongoose';
import { DoctorIdParamDto } from './dto/doctor-id-param.dto';
import { AuthGuard } from 'src/parent/guard/auth.guard';
import { Roles } from 'src/parent/decorator/Roles.decorator';
import { responseDto } from 'src/response.dto';

@Controller('v1/booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService,
    private readonly paymobService: PaymobService,
    // private readonly parentService: ParentService,
    @InjectModel(Parent.name) private parentModel: Model<Parent>,

  ) { }

  @Post()
  async create(@Body() createBookingDto: CreateBookingDto) {

    const booking = await this.bookingService.create(createBookingDto);
    
    if (booking.response.data?.paymentMethod === 'on-visit') {
      return {
        response: new responseDto(200, 'success', {
          booking: booking.response.data,
        }),
      };
    }
    else {
      try {
        const token = await this.paymobService.getAuthToken();
        if (!token) {
          throw new BadRequestException('there is problem in paymob token ');
        }

        if (!booking.response.data?.detectionPrice) {
          throw new BadRequestException('detection price is required');
        }

        const order = await this.paymobService.createOrder(token, booking.response.data.detectionPrice);
        booking.response.data.paymobOrderId = order.id;
        await booking.response.data.save();


        const parentId = booking.response.data.parentId;
        const parent = await this.parentModel.findById(parentId);

        if (!parent) {
          throw new BadRequestException('parent not found');
        }

        const paymentKey = await this.paymobService.getPaymentKey(
          token,
          order.id,
          booking.response.data.detectionPrice,
          parent.parentName,
          parent.phone,
          parent.email,
          parent?.government,
        );
        const paymentUrl = `https://accept.paymob.com/api/acceptance/iframes/984068?payment_token=${paymentKey}`;
        return {
          response: new responseDto(200, 'success', {
            booking: booking.response.data,
            paymentUrl,
          }),
        };

      } catch (error) {
        throw new BadRequestException('pyment issue');
      }
    }
  }


  @Get()
  findAll() {
    return this.bookingService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get('doctorAppointment/:doctorId')
  findDoctorAppointments(@Param() params: DoctorIdParamDto) {
    return this.bookingService.findDoctorAppointments(params.doctorId);
  }

  @UseGuards(AuthGuard)
  @Get('doctorAppointmentToday/:doctorId')
  findDoctorAppointmentsToday(@Param() params: DoctorIdParamDto) {
    return this.bookingService.findDoctorAppointmentsToday(params.doctorId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingService.findOne(id);
  }

  @Get('myAppointment/:id')
  findMyAppointment(@Param('id') id: string) {
    return this.bookingService.findMyAppointment(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto) {
    return this.bookingService.update(id, updateBookingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookingService.remove(id);
  }
  @Delete('cancel/child/:childId')
  cancel(@Param('childId') childId: string) {
    return this.bookingService.cancel(childId);
  }

  // @Roles(['parent'])
  // @UseGuards(AuthGuard)
  @Post(':id/rate')
  rate(@Param('id') id: string, @Body() rateBookingDto: RateBookingDto) {
    return this.bookingService.rateBooking(id, rateBookingDto);
  }
}
