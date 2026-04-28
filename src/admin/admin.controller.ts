import { Body, Controller, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminSignUpDto } from './dto/admin-sign-up.dto';
import { AdminSignInDto } from './dto/admin-sign-in.dto';

@Controller('v1/admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // @Post('sign-up')
  // async signUp(@Body() dto: AdminSignUpDto) {
  //   return await this.adminService.signUp(dto);
  // }

  @Post('sign-in')
  async signIn(@Body() dto: AdminSignInDto) {
    return await this.adminService.signIn(dto);
  }
}

