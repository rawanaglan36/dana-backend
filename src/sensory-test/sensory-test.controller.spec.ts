import { Test, TestingModule } from '@nestjs/testing';
import { SensoryTestController } from './sensory-test.controller';
import { SensoryTestService } from './sensory-test.service';

describe('SensoryTestController', () => {
  let controller: SensoryTestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SensoryTestController],
      providers: [SensoryTestService],
    }).compile();

    controller = module.get<SensoryTestController>(SensoryTestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
