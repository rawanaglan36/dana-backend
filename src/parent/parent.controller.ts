import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  ParseFilePipe,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Param,
} from '@nestjs/common';
import { SingInDto } from './dto/signIn.dto';
import { CreateParentDto } from './dto/create-parent.dto';
import { verifySignUpDto } from './dto/verifySignUp.dto';
import { ParentService } from './parent.service';
import { CreateChildDto } from './dto/child.dto';
import { PreSignUpDto } from './dto/preSignUp.dto';
import { AuthGuard } from './guard/auth.guard';
import { Roles } from './decorator/Roles.decorator';
import { UpdateParentDto } from './dto/update-parent.dto';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { AuthGuard as PassportAuthGuard } from '@nestjs/passport';
import { CompleteOAuthDto } from './dto/compeleteOauth.dto';
import { I18n, I18nContext, I18nLang, I18nService } from 'nestjs-i18n';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateChildDto } from './dto/update-child.dto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { checkAvailabilityDto } from './dto/check-availability.dto';
import { addPasswordDto } from './dto/add-password.dto';

@Controller('v1/parent')
export class ParentController {
  constructor(private readonly parentService: ParentService) { }


  @Post('pre-SignUp')
  @UseInterceptors(
    FileInterceptor('file'))
  async preSignUp(@Body() preSignUpDto:PreSignUpDto) {
      
    return await this.parentService.preSignUp(preSignUpDto);
  }


  @Post('check-availability')
  async checkAvailability(@Body() AvailableDto: checkAvailabilityDto
  ) {
    return await this.parentService.checkAvailability(AvailableDto);
  }
  @Post('verify-signUp')
  async verifyOtpAndSignUp(@Body() verifyDto: verifySignUpDto
  ) {
    return await this.parentService.verifyOtpAndSignUp(verifyDto);
  }

  @Roles(['parent', 'admin', 'doctor'])
  @UseGuards(AuthGuard)
  @Post('add-password')
  async addPassword(@Req() req,@Body() addPasswordDto: addPasswordDto
  ) {
    return await this.parentService.addPassword(req,addPasswordDto);
  }

  @Post('pre-signIn')
  async preSignIn(@Body() signInDto: SingInDto) {
    return await this.parentService.preSignIn(signInDto);
  }

  @Post('verify-signIn')
  async verifyAndSignIn(@Body() verifyDto: verifySignUpDto) {
    return await this.parentService.verifyAndSignIn(verifyDto);
  }

  @Post('reset-password')
  async resetPassword(@Body() resetDto: ResetPasswordDto) {
    return await this.parentService.resetPassword(resetDto);
  }
  @Post('verify-password-otp')
  async verifyResetPassword(@Body() verifyDto: verifySignUpDto) {
    return await this.parentService.verifyResetPassword(verifyDto);
  }
  @Roles(['parent', 'admin', 'doctor'])
  @UseGuards(AuthGuard)
  @Post('change-password')
  async changePassword(@Body() changeDto: ChangePasswordDto) {
    return await this.parentService.changePassword(changeDto);
  }
//admin

  // @Roles(['parent', 'admin', 'doctor'])
  // @UseGuards(AuthGuard)
  @Get('')
  async getAllParents() {
    return await this.parentService.getAllParents();
  }

  // @Roles(['parent', 'admin', 'doctor'])
  // @UseGuards(AuthGuard)
  @Get(':id')
  async getParent(@Param('id') id: string) {
    return await this.parentService.getParent(id);
  }
  // @Roles(['parent', 'admin', 'doctor'])
  // @UseGuards(AuthGuard)
  @Delete(':id/admin')
  async adminDeleteParent(@Param('id') id: string) {
    return await this.parentService.adminDeleteParent(id);
  }
  // @Roles(['parent', 'admin', 'doctor'])
  // @UseGuards(AuthGuard)
  @Patch(':id/soft-delete')
  async softDeleteParent(@Param('id') id: string) {
    return await this.parentService.softDeleteParent(id);
  }

  // @Roles(['parent', 'admin', 'doctor'])
  // @UseGuards(AuthGuard)
  @Patch(':id')
  async updateParent(@Param('id') id: string, @Body() updateDto: UpdateParentDto) {
    return await this.parentService.updateParent(id, updateDto);
  }
//admin



  @Get('google')
  @UseGuards(PassportAuthGuard('google'))
  async googleAuth() {
    // يتم تحويل المستخدم لتسجيل الدخول عبر Google
  }

  @Get('google/callback')
  @UseGuards(PassportAuthGuard('google'))
  googleAuthRedirect(@Req() req) {
    return {
      message: 'Logged in successfully with Google',
      token: req.user,
    };
  }

  @Get('google/compelete/:tempKey')
  // @UseGuards(AuthGuard('google'))
  async compeleteOauth(@Param('tempKey') tempKey: string,@Body() completeOauthDto: CompleteOAuthDto) {

    return await this.parentService.compeleteOauth(tempKey,completeOauthDto);
  }
    
  
  
  //   @Roles(['parent', 'admin', 'doctor'])
  // @UseGuards(AuthGuard)
    @Patch(':id/add-profile-image')
    @UseInterceptors(FileInterceptor('file'))
    addprofileImage(@Param('id') id: string,    
    @UploadedFile(
          new ParseFilePipe({
            fileIsRequired: true,
            validators: [
              new MaxFileSizeValidator({
                maxSize: 100000, // 100 KB
              }),
              new FileTypeValidator({
                fileType: /(jpg|jpeg|png)$/i,
              }),
    
            ],
          }),
        ) file: Express.Multer.File,) {
      return this.parentService.addprofileImage(id, file);
    }
}
@Controller('v1/parentMe')
export class parentMeController {
  constructor(private readonly parentService: ParentService) { }

  @Roles(['parent', 'admin', 'doctor'])
  @UseGuards(AuthGuard)
  @Get('')
  async getMe(@Req() req) {
    return await this.parentService.getMe(req);
  }
  
  @Roles(['parent', 'admin', 'doctor'])
  @UseGuards(AuthGuard)
  @Patch('')
  async updateMe(@Req() req, @Body() updateDto: UpdateParentDto) {
    return await this.parentService.updateMe(req, updateDto);
  }

  @Roles(['parent', 'admin', 'doctor'])
  @UseGuards(AuthGuard)
  @Post('addChild')
  async addChild(@Req() req, @Body() ChildDto: CreateChildDto) {
    return await this.parentService.addChild(req, ChildDto);
  }



  // @Roles(['parent', 'admin', 'doctor'])
  // @UseGuards(AuthGuard)
  @Patch('updateChild/:childId')
  @UseInterceptors(FileInterceptor('file'))
  async updateChild(@Param('childId') childId: string,@Body() update:UpdateChildDto) {

    return await this.parentService.updateChild(childId,update);
  }

  @Roles(['parent', 'admin', 'doctor'])
  @UseGuards(AuthGuard)
  @Delete('')
  async deleteMe(@Req() req) {
    return await this.parentService.deleteMe(req);
  }
}


@Controller('test')
export class TestController {
  constructor(private readonly i18n: I18nService) { }

  @Get('greet')
  async greet(@I18nLang() lang: string, @Query('name') name: string): Promise<any> {
    const greeting = await this.i18n.translate('greeting', { lang, args: { name } });
    return greeting;
  }
  @Get()
  async test(@I18n() i18n: I18nContext) {
    const hello = await i18n.t('dto.HELLO');
    return hello;
  }
}