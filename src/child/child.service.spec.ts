import { Test, TestingModule } from '@nestjs/testing';
import { ChildService } from './services/child.service';

describe('ChildService', () => {
  let service: ChildService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChildService],
    }).compile();

    service = module.get<ChildService>(ChildService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
