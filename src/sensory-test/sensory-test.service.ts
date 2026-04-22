import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSensoryTestDto } from './dto/create-sensory-test.dto';
import { UpdateSensoryTestDto } from './dto/update-sensory-test.dto';
import { InjectModel } from '@nestjs/mongoose';
import { SensoryTest, SensoryTestDocument } from 'schemas/sensory-test.schema';
import { SensoryTestController } from './sensory-test.controller';
import { Model } from 'mongoose';
import { CreateQuestionDto } from './dto/question.dto';
import { SensoryQuestion, SensoryQuestionDocument } from 'schemas/sensory-question.schema';
import { responseDto } from 'src/response.dto';

@Injectable()
export class SensoryTestService {

  constructor(
    @InjectModel(SensoryTest.name) private sensoryTestModel: Model<SensoryTestDocument>,
    @InjectModel(SensoryQuestion.name) private sensoryQuestionModel: Model<SensoryQuestionDocument>
  ) { }



  // groub of questions
  //admin
  async createBulkQuestions(questions: CreateQuestionDto[]) {
    try {
      const result = await this.sensoryQuestionModel.insertMany(questions, {
        ordered: false, //  continue even there is duplicate
      });

      return { response: new responseDto(200, 'question inserted', { count: result.length }) };
    } catch (err) {
      throw new BadRequestException('Error inserting question');
    }
  }

  async findAllQuestions() {
    const questions = await this.sensoryQuestionModel.find();
    return { response: new responseDto(200, 'success', questions) };
  }



  async createTestModel(childId: string, dto: CreateSensoryTestDto) {

    if (!childId) {
      throw new BadRequestException('the child id is not valid')
    }




    //repeated questions
    const ids = dto.answers.map(a => a.questionId);
    const uniqueIds = new Set(ids);
    if (uniqueIds.size !== ids.length) {
      throw new BadRequestException('there is repeated questions');
    }
    //repeated questions

    //check questions and there lenght
    const questions = await this.sensoryQuestionModel.find(
      {
        _id: { $in: ids },
        // options:{$in:qVal}
      });

    if (!questions) {
      throw new BadRequestException('not valid questions');
    }

    // const isValidOption = questions.options.some(
    //   (opt) => opt.value === qVal,
    // );

    if (dto.answers.length !== questions.length) {
      throw new BadRequestException('answer all questions or check the id is valid');
    }
    //check questions and there lenght

    //check options


    // if (!option) throw new Error('اختيار غير صالح');
    //check options

    let totalScore = 0;

    const categoryScores = {
      seeking: 0,
      avoiding: 0,
      sensitivity: 0,
      registration: 0,
    };

    for (const answer of dto.answers) {
      const question = questions.find(
        (q) => q._id.toString() === answer.questionId,
      );

      if (!question) throw new Error('wrong answer');

      totalScore += answer.selectedValue;

      categoryScores[question.category] += answer.selectedValue;
    }

    const level = this.getLevel(totalScore);

    const test = await this.sensoryTestModel.create({
      childId,
      answers: dto.answers,
      totalScore,
      level,
      categoryScores,
    });
    return { response: new responseDto(200, 'success', test) };
  }



  // level logic
  private getLevel(score: number): string {
    if (score <= 25) return 'low';
    if (score <= 36) return 'medium';
    return 'high';
  }

}
