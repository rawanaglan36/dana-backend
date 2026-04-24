import {
  BadRequestException,
  FileTypeValidator,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  MaxFileSizeValidator,
  NotFoundException,
  ParseFilePipe,
  UnauthorizedException,
  UploadedFile,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import * as bcrypt from 'bcrypt';
import { access } from 'fs';
import { responseDto } from 'src/response.dto';
import { Parent } from 'schemas/parent.schema';
import { CreateParentDto } from './dto/create-parent.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { verifySignUpDto } from './dto/verifySignUp.dto';
import { JwtService } from '@nestjs/jwt';
import { SingInDto } from './dto/signIn.dto';
import { CreateChildDto } from './dto/child.dto';
import { PreSignUpDto } from './dto/preSignUp.dto';
import { Child } from 'schemas/child.schema';
import { Types } from 'mongoose';
import { UpdateParentDto } from './dto/update-parent.dto';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { error } from 'console';
import type { RedisClientType } from 'redis';
import { CompleteOAuthDto } from './dto/compeleteOauth.dto';
import { UpdateChildDto } from './dto/update-child.dto';
import { Vonage } from '@vonage/server-sdk';
import { CloudinaryService } from 'src/upload-file/upload-file.service';
import axios from 'axios';
import { checkAvailabilityDto } from './dto/check-availability.dto';
import { addPasswordDto } from './dto/add-password.dto';

@Injectable()
export class ParentService {
  // private preUsers = new Map<string, any>();
  constructor(
    @InjectModel(Parent.name) private parentModel: Model<Parent>,
    @InjectModel(Child.name) private childModel: Model<Child>,
    private jwt: JwtService,
    private mailerService: MailerService,
    private config: ConfigService,
    private cloudinaryService: CloudinaryService,

    // private vonage: Vonage,
    @Inject('REDIS_CLIENT') private readonly redis: RedisClientType,
  ) { }

 async checkAvailability  (body: checkAvailabilityDto) 
{
  if (!body ) {
    throw new BadRequestException('Parent data is required');
  }
  const userByPhone = await this.parentModel.findOne({
    phone: body.phone,
  });
  const userByEmail = await this.parentModel.findOne({
    email: body.email,
  });
  if (userByEmail || userByPhone) {
    throw new BadRequestException('user allready exist');
  }
}
  async preSignUp(body: PreSignUpDto) {
    
    if (!body || !body.parent) {
      throw new BadRequestException('Parent data is required');
    }
    const userByPhone = await this.parentModel.findOne({
      phone: body.parent.phone,
    });
    const userByEmail = await this.parentModel.findOne({
      email: body.parent.email,
    });
    if (userByEmail || userByPhone) {
      throw new BadRequestException('user allready exist');
    }
    // if (body.parent.password) {
    //   throw new BadRequestException('not allowed to add password here');
    // }
    // const { parentName, government, address, phone, email } = body.parent;



    const verfictionCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();

    try {
      await this.mailerService.sendMail({
        from: `Dana NestJS <${process.env.EMAIL_USER}>`,
        to: body.parent.email,
        subject: 'Verify OTP of sign up',
        html: `
        <div style="text-align: center;">
        <h3>Your Verification Code</h3>
        <h3 style="color: red; font-weight: bold;">
            ${verfictionCode}
        </h3>
        <h6 style="color: gray;">
            Dana NestJS Project
        </h6>
        </div>
    `,
      });
    } catch (err) {
      console.error('Email sending failed', err);
      throw new BadRequestException('Failed to send OTP email, try again later');
    }


    try {
      await this.redis.set(
        `pre_user:${body.parent.phone}`,
        JSON.stringify({
          parentDto: body.parent,
          childrenDto: body.children,
          otp: verfictionCode,
          createdAt: Date.now(),
        }),
        { EX: 600 }
      );
    } catch (err) {
      // console.error('Redis set failed', err);
      throw new BadRequestException('Server error, please try again later');
    }

    try {
      const existingUser = await this.parentModel.findOne({
        $or: [
          { email: body.parent.email },
          { phone: body.parent.phone },
        ],
      });

      if (existingUser) {
        throw new BadRequestException('User with this email or phone already exists');
      }

      // لو حبيت تعمل insert هنا مباشرة، استخدم try/catch للـ duplicate key
      // await this.parentModel.create(body.parent);

    } catch (err2) {
      if ((err2 as any).code === 11000) {
        throw new BadRequestException('User with this email or phone already exists');
      }
      throw err2;
    }

    return {
      response: new responseDto(200, 'OTP sent to your email successfully',)
    };
  }
  async sendCustomOTP(phoneNumber: string, otpCode: string) {
    const from = "VONAGE";
    const to = `2${phoneNumber}`;
    const text = `Your verification code is ${otpCode}`;

    const vonage = new Vonage({
      apiKey: "04b56ae0",
      apiSecret: "XfPHW55kYX8Ew05J"
    });


    try {
      await vonage.sms.send({ to, from, text })
        .then(resp => { console.log('Message sent successfully'); console.log(resp); })
        .catch(err => { console.log('There was an error sending the messages.'); console.error(err); });
    } catch (err) {
      console.log('Error sending SMS via Vonage', err);
      throw err;
    }
  }


  async verifyOtpAndSignUp(veriyDto: verifySignUpDto) {
    const { phone, otp } = veriyDto;
    const dataStr = await this.redis.get(`pre_user:${phone}`);
    if (!dataStr) {
      throw new BadRequestException('no otp request found');
    }
    const data = JSON.parse(dataStr);
    const now = Date.now();
    if (now - data.createdAt > 5 * 60 * 1000) {
      await this.redis.del(`pre_user:${phone}`);
      throw new BadRequestException('OTP expired');
    }

    if (data.otp != otp) {
      throw new BadRequestException('invalid OTP');
    }

    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(data.parentDto.password, salt);
    
    //create parent
    const newParent = {
      ...data.parentDto,
      // password: hashedPassword,
      isActive: true,
    };

    const parentCreated = await this.parentModel.create(newParent);
    //creat children
    const childrenIds: Types.ObjectId[] = [];
    for (const c of data.childrenDto) {
      const age = this.calculateAge(c.birthDate);
      const newChild = await this.childModel.create({
        ...c,
        age,
        parentId: parentCreated._id,
      });
      childrenIds.push(newChild._id);
    }

    await this.parentModel.findByIdAndUpdate(parentCreated._id, {
      $set: { children: childrenIds },
    });

    await this.redis.del(`pre_user${phone}`);

    const accessToken = await this.signToken(
      parentCreated._id.toString(),
      parentCreated.phone,
      'parent',
    );
    return {
      response: new responseDto(200, 'parent created successfully'),
      accessToken: accessToken,
    };
  }

  async addPassword(payload,body:addPasswordDto){
        const user2 = await this.parentModel.findById(payload.user.sub);
    if (!user2) {
      throw new NotFoundException('User not found');
    }
     const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(body.password, salt);
    const user =await this.parentModel.findByIdAndUpdate(payload.user.sub,{
      $set: { password: hashedPassword },
    });
    if(!user){
      throw new NotFoundException('User not found');
    }
    return {response: new responseDto(200, 'password added successfully')};
  }

  async addprofileImage(id: string , file:Express.Multer.File){
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('invalid input');
    }
    if (!file) {
    throw new BadRequestException('Profile image is required');
  }
  
  
    //profile image
    let profileImage: string | null = null;
    let profileImagePublicId: string | null = null;
    if (file) {
      try {
        const imageFile = await this.cloudinaryService.uploadFile(file);
        profileImage = imageFile.secure_url;
        //if not work in client side use this
        // const profileImage=imageFile.url;
        profileImagePublicId = imageFile.public_id;
      }
  catch (err) {
    throw new InternalServerErrorException('Image upload failed');
  }
    }
    const updateData: any = {};
  
  if (profileImage) updateData.profileImage = profileImage;
  if (profileImagePublicId) updateData.profileImagePublicId = profileImagePublicId;
  
    //profile image
    const updatedparent =await this.parentModel.findByIdAndUpdate(id,updateData,{new:true})
    if (!updatedparent) {
      throw new NotFoundException('parent not found');
    }
    return { response: new responseDto(200, 'success', updatedparent) };
  }

  private calculateAge(birthDate: string): number {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  }

  async preSignIn(signInDto: SingInDto) {
    try {
      const { phone, password } = signInDto;
      const user = await this.parentModel
        .findOne({ phone: phone })
        .select('+password');

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const isPasswordMatch = await bcrypt.compare(password, user.password);

      if (!isPasswordMatch) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const verfictionCode = Math.floor(
        100000 + Math.random() * 900000,
      ).toString();

      await this.mailerService.sendMail({
        from: `Dana NestJS <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: 'verify OTP for sign-in ',
        html: `
          <div style="text-align: center;">
          <h3>Your Verification Code</h3>
          <h3 style="color: red; font-weight: bold;">
              ${verfictionCode}
          </h3>
          <h6 style="color: gray;">
              Dana NestJS Project
          </h6>
          </div>
      `,
      });

      const userObj = user.toObject() as any;
      delete userObj.password;

      await this.redis.set(
        `pre_user:${phone}`,
        JSON.stringify({
          parentDto: userObj,
          // childrenDto: user.children,
          otp: verfictionCode,
          createdAt: Date.now(),
        }),
        { EX: 600 },
      );

      return {
        response: new responseDto(200, 'otp send to your email')
      };
    } catch (error) {
      throw error;
    }
  }
  async verifyAndSignIn(verifyDto: verifySignUpDto) {
    const { phone, otp } = verifyDto;
    // const data = this.preUsers.get(phone);
    const dataStr = await this.redis.get(`pre_user:${phone}`);
    if (!dataStr) {
      throw new BadRequestException('No OTP request found');
    }
    const data = JSON.parse(dataStr);
    if (!data) {
      throw new BadRequestException('no otp request found');
    }
    const now = Date.now();
    if (now - data.createdAt > 5 * 60 * 1000) {
      // this.preUsers.delete(phone);
      await this.redis.del(`pre_user${phone}`);
      throw new BadRequestException('OTP expired');
    }
    if (data.otp != otp) {
      throw new BadRequestException('invalid OTP');
    }
    const user = await this.parentModel.findOne({ phone: phone });

    const accessToken = await this.signToken(
      data.parentDto._id.toString(),
      data.parentDto.phone,
      'parent',
    );

    return {
      response: new responseDto(200, 'success'),
      accessToken,
    };
  }

  async resetPassword(resetDto: ResetPasswordDto) {
    const { phone } = resetDto;
    const parent = await this.parentModel.findOne({ phone: phone });
    if (!parent) {
      throw new NotFoundException();
    }
    const verfictionCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();

    await this.mailerService.sendMail({
      from: `Dana NestJS <${process.env.EMAIL_USER}>`,
      to: parent.email,
      subject: 'verify OTP for sign-in ',
      html: `
          <div style="text-align: center;">
          <h3>Your Verification Code</h3>
          <h3 style="color: red; font-weight: bold;">
              ${verfictionCode}
          </h3>
          <h6 style="color: gray;">
              Dana NestJS Project
          </h6>
          </div>
      `,
    });
    await this.parentModel.findByIdAndUpdate(
      parent._id,
      { verficationCode: verfictionCode },
      { new: true },
    );
    return {
      response: new responseDto(200, 'otp send in your email')
    };
  }
  async verifyResetPassword(verifyDto: verifySignUpDto) {
    try {
      const { otp, phone } = verifyDto;
      if (!otp || !phone) {
        throw new BadRequestException('otp and phone are required');
      }
      const parent = await this.parentModel.findOne({ phone: phone });
      if (!parent) {
        throw new NotFoundException();
      }
      if (parent.verficationCode !== otp) {
        throw new BadRequestException('Invalid otp');
      }
      await this.parentModel.findByIdAndUpdate(
        parent._id,
        { $unset: { verficationCode: 1 } },
        { new: true },
      );
      const { access_token } = await this.signToken(parent.id, parent.phone, 'parent');
      return {
        response: new responseDto(200, 'success'),
        accessToken: access_token,
      };
    } catch (error) {
      throw error;
    }
  }
  async changePassword(changeDto: ChangePasswordDto) {
    try {
      const { phone, password } = changeDto;
      const parent = await this.parentModel.findOne({ phone: phone });
      if (!parent) {
        throw new NotFoundException('user not found');
      }
      if (parent?.verficationCode) {
        throw new UnauthorizedException('you must verfiy code first');
      }
      if (!password) {
        throw new BadRequestException('password not exist');
      }
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);

      await this.parentModel.findByIdAndUpdate(
        parent._id,
        { password: hash },
        { new: true },
      );
      return {
        response: new responseDto(200, 'success'),
      };
    } catch (error) {
      throw error;
    }
  }

  async validateGoogleUser(profile: any) {
    console.log(profile);
    const { emails, displayName, id } = profile;

    const email = emails?.[0]?.value;

    const user = await this.parentModel.findOne({ email: email });

    if (!user) {
      const tempKey = crypto.randomUUID();
      const user = await this.redis.set(
        `oauth_temp:${tempKey}`,
        JSON.stringify({
          email,
          parentName: displayName,
          provider: 'google',
          providerId: id,
        }),
        { EX: 600 }, //10m
      );
      return {
        response: new responseDto(
          200,
          'Complete signup with phone and password',
        ),
        tempKey: tempKey,
      };
    }

    const token = await this.signToken(user.id, user.email, 'parent');
    return {
      response: new responseDto(200, 'success', user),
      accessToken: token,
    };
  }
  async compeleteOauth(compeleteGoogleDto: CompleteOAuthDto) {
    const dataStr = await this.redis.get(
      `oauth_temp:${compeleteGoogleDto.tempKey}`,
    );
    if (!dataStr) {
      throw new BadRequestException('no tempKey request found');
    }
    const data = JSON.parse(dataStr);

    // const now = Date.now();
    // if (now - data.createdAt > 5 * 60 * 1000) {
    //   await this.redis.del(`oauth_temp:${compeleteGoogle.tempKey}`);
    //   throw new BadRequestException('OTP expired')
    // }
    // if (data.otp != otp) {
    //   throw new BadRequestException('invalid OTP').children
    // }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(compeleteGoogleDto.password, salt);

    //create parent
    const newParent = {
      ...data,
      phone: compeleteGoogleDto.phone,
      password: hashedPassword,
      isActive: true,
    };

    const parentCreated = await this.parentModel.create(newParent);
    //creat children
    const childrenIds: Types.ObjectId[] = [];
    for (const c of compeleteGoogleDto.children) {
      const age = this.calculateAge(c.birthDate);
      const newChild = await this.childModel.create({
        ...c,
        age,
        parentId: parentCreated._id,
      });
      childrenIds.push(newChild._id);
    }

    await this.parentModel.findByIdAndUpdate(parentCreated._id, {
      $set: { children: childrenIds },
    });

    await this.redis.del(`oauth_temp:${compeleteGoogleDto.tempKey}`);

    const accessToken = await this.signToken(
      parentCreated._id.toString(),
      parentCreated.phone,
      'parent',
    );
    return {
      response: new responseDto(200, 'parent created successfully'),
      accessToken: accessToken,
    };
  }

  async getMe(payload) {
    try {
      const user = await this.parentModel
        .findById(payload.user.sub)
        .populate('children');
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const userObj = user.toObject() as any;
      delete userObj.password;
      delete userObj.__v;
      return {
        response: new responseDto(200, 'success', userObj),
        // parent: userObj
      };
    } catch (error) {
      throw new NotFoundException('Failed to get user data');
    }
  }
  async updateMe(payload, updateDto: UpdateParentDto) {
    if (updateDto.isActive) {
      throw new BadRequestException('you can not update isActive field');
    }
    if (updateDto.password) {
      updateDto.password = await bcrypt.hash(updateDto.password, 10);
    }
    const user = await this.parentModel.findById(payload.user.sub);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const updatedUser = await this.parentModel
      .findByIdAndUpdate(payload.user.sub, updateDto, { new: true })
      .select('-password -__v');
    return {
      response: new responseDto(200, 'success', updatedUser),
    };
  }
  async addChild(payload, ChildDto: CreateChildDto) {

    const user = await this.parentModel.findById(payload.user.sub);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    //creat children
    const childrenIds: Types.ObjectId[] = [];
    const age = this.calculateAge(ChildDto.birthDate.toString());
    let newChild;
    try {
      newChild = await this.childModel.create({
        ...ChildDto,
        age,
        parentId: user._id,
      });
      childrenIds.push(newChild._id);
    } catch (err) {
      throw new BadRequestException('Failed to create child');
    }

    try {
      await this.parentModel.findByIdAndUpdate(user._id, {
        $addToSet: { children: newChild._id },
      });
    } catch (err) {
      throw new BadRequestException('Failed to update parent');
    }


    return {
      response: new responseDto(200, 'success', newChild),
    };
  }

  async updateChild(childId: string, updateDto: UpdateChildDto) {
if (!Types.ObjectId.isValid(childId)) {
      throw new BadRequestException('Invalid child id');
    }
    const child = await this.childModel.findById(childId);
    if (!child) {
      throw new NotFoundException('Child not found');
    }



    if (updateDto.isActive === true || updateDto.isActive === false) {
      throw new BadRequestException('you can not update isActive field');
    }

    if (updateDto.birthDate) {
      updateDto.age = this.calculateAge(updateDto.birthDate.toString());
    }

    const updatedChild = await this.childModel.findByIdAndUpdate(childId, updateDto, { new: true });
    return {
      response: new responseDto(200, 'child updated successfully', updatedChild),
    };
  }

  async deleteMe(payload) {
    const id = payload.user.sub;
    const parent = await this.parentModel.findById(id);
    if (!parent) {
      throw new NotFoundException('User not found');
    }
    if (parent.profileImagePublicId) {
      // throw new BadRequestException('User profile image not found');
      await this.cloudinaryService.deleteFile(parent.profileImagePublicId);
    }

    const user = await this.parentModel
      .findByIdAndUpdate(id, { isActive: false }, { new: true })
      .select('-password -__v');
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return {
      response: new responseDto(200, 'success', user),
    };
  }

  async signToken(
    userId: string,
    phone: string,
    role: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      phone,
      role,
    };
    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      algorithm: 'HS256',
      secret: secret,
    });

    return {
      access_token: token,
    };
  }
}
