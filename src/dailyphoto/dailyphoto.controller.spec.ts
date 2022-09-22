import { Test, TestingModule } from '@nestjs/testing';
import { DailyphotoController } from './dailyphoto.controller';
import { DailyphotoService } from './dailyphoto.service';

describe('DailyphotoController', () => {
  let controller: DailyphotoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DailyphotoController],
      providers: [DailyphotoService],
    }).compile();

    controller = module.get<DailyphotoController>(DailyphotoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
