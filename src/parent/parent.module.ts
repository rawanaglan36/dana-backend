import { Module } from '@nestjs/common';
import { ParentService } from './parent.service';
import { ParentController, parentMeController, TestController } from './parent.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Parent, ParentSchema } from 'schemas/parent.schema';
import { Child, ChildSchema } from 'schemas/child.schema';
import { GoogleStrategy } from './strategy/google.strategy';
import { PassportModule } from '@nestjs/passport';
import { RedisModule } from 'src/redis.module';
import { CloudinaryService } from 'src/upload-file/upload-file.service';
import { UploadModule } from 'src/upload-file/upload-file.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Parent.name, schema: ParentSchema },
      { name: Child.name, schema: ChildSchema },
    ]),
    RedisModule,
    UploadModule,
    PassportModule.register({ session: false }),
  ],
  controllers: [ParentController, parentMeController,TestController],
  providers: [ParentService, GoogleStrategy],
})
export class ParentModule {}
