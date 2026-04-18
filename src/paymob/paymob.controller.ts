import { BadRequestException, Body, Controller, Get, Post, Query } from "@nestjs/common";
import { BookingService } from "src/booking/booking.service";
import { verifyPaymobHmac } from "./paymob.util";

@Controller('v1/paymob')
export class PaymobController {
  constructor(private readonly bookingService: BookingService) {}



  @Get('callback')
  async handleCallback(@Body() body: any ,@Query() query: any) {

//      const isValidHmac = verifyPaymobHmac(
//     query,
//     process.env.PAYMOB_HMAC_SECRET!,
//   );

//   if (!isValidHmac) {
//     throw new BadRequestException('Invalid HMAC');
//   }

    // console.log(body);
    // console.log("===============================================");
    // console.log(query);
    // console.log(query.success);
    // console.log(typeof(query.success));
    
    // console.log(query.error_occured);
    if (query.success === 'false' ) {
      throw new BadRequestException('payment failed');
    }
    if (query.error_occured === 'true') {
      throw new BadRequestException('payment failed');
    }

      await this.bookingService.markAsPaid(
        Number(query.order),
        Number(query.id),    
      );
      return { received: true ,status: 'success' };
    }
  }

