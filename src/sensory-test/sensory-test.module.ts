import { Module } from '@nestjs/common';
import { SensoryTestService } from './sensory-test.service';
import { SensoryTestController } from './sensory-test.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SensoryTest, SensoryTestSchema } from 'schemas/sensory-test.schema';
import { SensoryQuestion, SensoryQusetionSchema } from 'schemas/sensory-question.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: SensoryTest.name, schema: SensoryTestSchema }]),
    MongooseModule.forFeature([{ name: SensoryQuestion.name, schema: SensoryQusetionSchema }]),
  ],
  controllers: [SensoryTestController],
  providers: [SensoryTestService],
})
export class SensoryTestModule { }
