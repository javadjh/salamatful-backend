import { Test, TestingModule } from '@nestjs/testing';
import { WebblogController } from './webblog.controller';
import { WebblogService } from './webblog.service';

describe('WebblogController', () => {
  let controller: WebblogController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WebblogController],
      providers: [WebblogService],
    }).compile();

    controller = module.get<WebblogController>(WebblogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
