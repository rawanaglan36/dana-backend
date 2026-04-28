import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { responseDto } from 'src/response.dto';
import { Admin } from 'schemas/admin.schema';
import { AdminSignUpDto } from './dto/admin-sign-up.dto';
import { AdminSignInDto } from './dto/admin-sign-in.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<Admin>,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signUp(dto: AdminSignUpDto) {
    const userByPhone = await this.adminModel.findOne({ phone: dto.phone });
    const userByEmail = await this.adminModel.findOne({ email: dto.email });
    if (userByEmail || userByPhone) {
      throw new BadRequestException('user allready exist');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(dto.password, salt);

    try {
      const admin = await this.adminModel.create({
        adminName: dto.adminName,
        email: dto.email,
        phone: dto.phone,
        password: hashedPassword,
        role: 'admin',
        isActive: true,
      });

      const accessToken = await this.signToken(
        admin._id.toString(),
        admin.phone,
        'admin',
      );

      const adminObj = admin.toObject() as any;
      delete adminObj.password;
      delete adminObj.__v;

      return {
        response: new responseDto(200, 'created successfully', adminObj),
        accessToken,
      };
    } catch (err) {
      if ((err as any)?.code === 11000) {
        throw new BadRequestException('user allready exist');
      }
      throw err;
    }
  }

  async signIn(dto: AdminSignInDto) {
    const user = await this.adminModel
      .findOne({ email: dto.email })
      .select('+password');

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordMatch = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = await this.signToken(
      user._id.toString(),
      user.phone,
      'admin',
    );

    const userObj = user.toObject() as any;
    delete userObj.password;
    delete userObj.__v;

    return {
      response: new responseDto(200, 'success', userObj),
      accessToken,
    };
  }

  async signToken(
    userId: string,
    phone: string,
    role: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      _id: userId,
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

