import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ParentModule } from './parent/parent.module';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { JwtModule } from '@nestjs/jwt';
import { DoctorModule } from './doctor/doctor.module';
import { BookingModule } from './booking/booking.module';
import { ChatGateway } from './chat/chat.gateway';
import { ChatController } from './chat/chat.controller';
import { ChatService } from './chat/chat.service';
import { UploadModule } from './upload-file/upload-file.module';
import { HeaderResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import { join } from 'path';
// import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { PaymobModule } from './paymob/paymob.module';
import { ChildModule } from './child/child.module';
import {  TextBooksModule } from './textBooks/textBooks.module';
import { VideosModule } from './videos/videos.module';
import { SensoryTestModule } from './sensory-test/sensory-test.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 10,
        },
      ],
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: join(process.cwd(), 'dist/src/i18n'),
        watch: true,
      },
      resolvers: [
        new QueryResolver(['lang']),
        new HeaderResolver(['x-lang']),
      ],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // MongooseModule.forRoot('mongodb://localhost:27017/dana'),
    MongooseModule.forRoot(process.env.MONGO_URL||''),

    MailerModule.forRoot({
      transport: {
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      },
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: {
        algorithm: 'HS256',
        expiresIn: '60s',
      },
    }),
    ParentModule,
    DoctorModule,
    BookingModule,
    UploadModule,
    PaymobModule,
    ChildModule,
    TextBooksModule,
    VideosModule,
    SensoryTestModule,
    AdminModule,
  ],
  controllers: [AppController, ChatController],
  providers: [AppService, ChatGateway, ChatService],
})
export class AppModule { }
