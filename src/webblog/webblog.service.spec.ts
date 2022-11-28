import { Test, TestingModule } from '@nestjs/testing';
import { WebblogService } from './webblog.service';

describe('WebblogService', () => {
  let service: WebblogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WebblogService],
    }).compile();

    service = module.get<WebblogService>(WebblogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
