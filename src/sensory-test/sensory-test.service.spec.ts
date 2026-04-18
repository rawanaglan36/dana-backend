import { Test, TestingModule } from '@nestjs/testing';
import { SensoryTestService } from './sensory-test.service';

describe('SensoryTestService', () => {
  let service: SensoryTestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SensoryTestService],
    }).compile();

    service = module.get<SensoryTestService>(SensoryTestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
