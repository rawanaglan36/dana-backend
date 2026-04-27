import { BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Doctor } from 'schemas/doctor.schema';
import * as bcrypt from 'bcrypt';
import { responseDto } from 'src/response.dto';
import { CloudinaryService } from 'src/upload-file/upload-file.service';
import { Book } from 'schemas/booking.schema';
import { UpdateDoctorAppointmentsDto } from './dto/update-doctor-appointments.dto';
import { UpdateDoctorNotificationsDto } from './dto/update-doctor-notfications.dto';
import { SingInDto } from './dto/signIn.dto';
import { verifySignInDto } from './dto/verifySignUp.dto';
import type { RedisClientType } from 'redis';
import { AdminSignUpDto } from './dto/admin-sign-up.dto';
import { UpdateDoctorAdminDto } from './dto/update-doctor-admin.dto';

@Injectable()
export class DoctorService {
  constructor(
    @InjectModel(Doctor.name) private doctorModel: Model<Doctor>,
    private cloudinaryService: CloudinaryService,
    @InjectModel(Book.name) private bookModel: Model<Book>,
    private jwt: JwtService,
    private mailerService: MailerService,
    private config: ConfigService,
    @Inject('REDIS_CLIENT') private readonly redis: RedisClientType,

  ) { }
  async create(createDoctorDto: CreateDoctorDto, file?: Express.Multer.File) {
    try {
      const {phone } = createDoctorDto;
      // const doctorEmail = await this.doctorModel.findOne({ email: email });
      const doctorPhone = await this.doctorModel.findOne({ phone: phone });
      if (doctorPhone) {
        throw new BadRequestException('user already exist');
      }
      //CV
      let cv: string | null = null;
      let cvPublicId: string | null = null;
      if (file) {
        const cvFile = await this.cloudinaryService.uploadFile(file);
        cv = cvFile.secure_url;

        //if not work in client side use this
        // const profileImage=imageFile.url;

        cvPublicId = cvFile.public_id;
      }
      //CV


      // const verfictionCode = Math.floor(
      //   100000 + Math.random() * 900000
      // ).toString();

      const doctor = await this.doctorModel.create({ ...createDoctorDto, cv, cvPublicId });
      const doctorObj = doctor.toObject() as any;
      delete doctorObj.password;
      delete doctorObj.__v;
      return { response: new responseDto(200, 'success', doctorObj) };
    } catch (error) {
      if (error === 11000) {
        throw new BadRequestException('this date already booked');
      }
      throw error;
    }
  }

  async findAll() {
    try {
      const doctors = await this.doctorModel.find().select('-password -__v');
      return { response: new responseDto(200, 'success', doctors) };
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('invalid input');
      }
      const doctor = await this.doctorModel
        .findById(id)
        .select('-password -__v');
      if (!doctor) {
        throw new NotFoundException('doctor not found');
      }
      if (doctor.isActive == false) {
        throw new BadRequestException('doctor is inactive');
      }
      const bookings = await this.bookModel
        .find({ doctorId: id })
        .select('_id childId patientId doctorId date time  status price');
      return { response: new responseDto(200, 'success', { ...doctor.toObject(), bookings }) };
    } catch (error) {
      throw error;
    }
  }

  async getAvailableSlots(doctorId: string, date: string) {
    try {
      if (!Types.ObjectId.isValid(doctorId)) {
        throw new BadRequestException('invalid input');
      }

      const doctor = await this.doctorModel.findById(doctorId).select('-password -__v');
      if (!doctor) {
        throw new NotFoundException('doctor not found');
      }
      if (doctor.isActive == false) {
        throw new BadRequestException('doctor is inactive');
      }

      const day = doctor.availability?.find(d => d.date === date);
      if (!day) {
        throw new BadRequestException('doctor not avilable this date');
      }

      const bookings = await this.bookModel.find({
        doctorId,
        date,
        status: { $ne: 'cancelled' },
      });

      const bookedTimes = bookings.map(b => b.time);
      const freeTimes = day.times.filter(t => !bookedTimes.includes(t));

      return {
        response: new responseDto(200, 'success', {
          date,
          availableTimes: freeTimes,
          bookedTimes,
        }),
      };
    } catch (error) {
      throw error;
    }
  }

  async AdminSignUp(id:string,signUpDto: AdminSignUpDto){
  
  if (!Types.ObjectId.isValid(id)) {
    throw new BadRequestException('invalid input');
  }

  const doctor = await this.doctorModel.findById(id);
  if (!doctor){
    throw new NotFoundException('doctor not found');
  }

  // const doctorPhone = await this.doctorModel.findOne({ 
  //   phone: signUpDto.phone,
  //   _id: { $ne: id }
  // });
  // if (doctorPhone) {
  //   throw new BadRequestException('phone already exist');
  // }

  const doctorEmail = await this.doctorModel.findOne({ 
    email: signUpDto.email,
    _id: { $ne: id }
  });
  if (doctorEmail) {
    throw new BadRequestException('email already exist');
  }

  const hashedPassword = await bcrypt.hash(signUpDto.password, 10);

  const doctorUpdated = await this.doctorModel.findByIdAndUpdate(
    id,
    {
      ...signUpDto,
      password: hashedPassword,
      isActive: true,
      role: 'doctor'
    },
    { new: true }
  );

  const accessToken = await this.signToken(
    doctorUpdated!._id.toString(),
    doctorUpdated!.phone,
    'doctor',
  );

  return {
    response: new responseDto(200, 'doctor created successfully'),
    accessToken,
  };
  }
  

  async preSignIn(signInDto: SingInDto) {
    try {
      const { email, password } = signInDto;
      const user = await this.doctorModel
        .findOne({ email: email })
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
        `pre_user:${email}`,
        JSON.stringify({
          doctorDto: userObj,
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
  async verifyAndSignIn(verifyDto: verifySignInDto) {
    const { email, otp } = verifyDto;
    // const data = this.preUsers.get(phone);
    const dataStr = await this.redis.get(`pre_user:${email}`);
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
      await this.redis.del(`pre_user${email}`);
      throw new BadRequestException('OTP expired');
    }
    if (data.otp != otp) {
      throw new BadRequestException('invalid OTP');
    }
    const user = await this.doctorModel.findOne({ email: email });
    if(!user){
      throw new NotFoundException('user not found');
    }
    user.isVerified = true;
    await user.save();

    const accessToken = await this.signToken(
      data.doctorDto._id.toString(),
      data.doctorDto.email,
      'doctor',
    );

    return {
      response: new responseDto(200, 'success'),
      accessToken,
    };
  }

  async update(id: string, updateDoctorDto: UpdateDoctorDto) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('invalid input');
      }
      const doctor = await this.doctorModel.findById(id);
      if (!doctor) {
        throw new BadRequestException('doctor not found');
      }

      const {  password , phone } = updateDoctorDto;
      const doctorPhone = await this.doctorModel.findOne({ phone: phone });
      if (doctorPhone) {
        throw new BadRequestException('user already exist');
      }

      if (password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        updateDoctorDto.password = hashedPassword;
      }


      const updateDoctor = await this.doctorModel
        .findByIdAndUpdate(id, {$set:updateDoctorDto} , { new: true })
        .select('-password -__v');
      return { response: new responseDto(200, 'success', updateDoctor) };
    } catch (error) {
      throw error;
    }
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
    const updatedDoctor =await this.doctorModel.findByIdAndUpdate(id,updateData,{new:true})
    if (!updatedDoctor) {
      throw new NotFoundException('doctor not found');
    }
    return { response: new responseDto(200, 'success', updatedDoctor) };
  }


  async updateAppointments(id: string, updateDoctorAppointmentsDto: UpdateDoctorAppointmentsDto) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('invalid input');
      }
      const doctor = await this.doctorModel.findById(id);
      if (!doctor) {
        throw new BadRequestException('doctor not found');
      }

      const updateDoctor = await this.doctorModel
        .findByIdAndUpdate(id, updateDoctorAppointmentsDto, { new: true })
        .select('-password -__v');
      return { response: new responseDto(200, 'success', updateDoctor) };
    } catch (error) {
      throw error;
    }
  }

  async updateNotifications(id: string, updateDoctorNotificationsDto: UpdateDoctorNotificationsDto) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('invalid input');
      }
      const doctor = await this.doctorModel.findById(id);
      if (!doctor) {
        throw new BadRequestException('doctor not found');
      }

      const updateDoctor = await this.doctorModel
        .findByIdAndUpdate(id, updateDoctorNotificationsDto, { new: true })
        .select('-password -__v');
      return { response: new responseDto(200, 'success', updateDoctor) };
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string) {
    try {
      const doctor = await this.doctorModel.findById(id);
      if (!doctor) {
        throw new BadRequestException('doctor not found');
      }
      if (doctor.profileImagePublicId) {
        await this.cloudinaryService.deleteFile(doctor.profileImagePublicId);
      }

      const deleteDoctor = await this.doctorModel
        .findByIdAndUpdate(id, { isActive: false }, { new: true })
        .select('-password -__v');
      return { response: new responseDto(200, 'success', deleteDoctor) };
    } catch (error) {
      throw error;
    }
  }
  async adminDeleteDoctor(id: string) {
    try {
      const doctor = await this.doctorModel.findById(id);
      if (!doctor) {
        throw new BadRequestException('doctor not found');
      }
      if (doctor.profileImagePublicId) {
        await this.cloudinaryService.deleteFile(doctor.profileImagePublicId);
      }

      const deleteDoctor = await this.doctorModel
        .findByIdAndDelete(id);
      return { response: new responseDto(200, 'success', deleteDoctor) };
    } catch (error) {
      throw error;
    }
  }

  async confirm(childId: string, doctorId: string) {
    try {
      if (!Types.ObjectId.isValid(childId)) {
        throw new BadRequestException('invalid input');
      }

      const book = await this.bookModel.findOne({ childId, doctorId });
      if (!book) throw new NotFoundException('booking not found');

      const updatedBook = await this.bookModel.findByIdAndUpdate(book._id, { isCompletedConsultation: true }, { new: true });
      return { response: new responseDto(200, 'success', updatedBook) };
    } catch (error) {
      throw error;
    }
  }


  async updateDoctorAdmin(id: string, updateDoctorAdminDto: UpdateDoctorAdminDto) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('invalid input');
      }
      const doctor = await this.doctorModel.findById(id);
      if (!doctor) {
        throw new BadRequestException('doctor not found');
      }

      const updateDoctor = await this.doctorModel
        .findByIdAndUpdate(id, updateDoctorAdminDto, { new: true })
        .select('-password -__v');
      return { response: new responseDto(200, 'success', updateDoctor) };
    } catch (error) {
      throw error;
    }
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
