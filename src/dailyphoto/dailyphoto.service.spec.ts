import { Test, TestingModule } from '@nestjs/testing';
import { DailyphotoService } from './dailyphoto.service';

describe('DailyphotoService', () => {
  let service: DailyphotoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DailyphotoService],
    }).compile();

    service = module.get<DailyphotoService>(DailyphotoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
