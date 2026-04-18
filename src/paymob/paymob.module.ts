import { Module } from '@nestjs/common';
import { PaymobService } from 'src/paymob/paymob.service';
import { PaymobController } from './paymob.controller';
import { BookingModule } from 'src/booking/booking.module';

@Module({
  imports: [BookingModule],
  controllers: [PaymobController],
  // providers: [PaymobService],
})
export class PaymobModule {}
