import { Body, Controller, Post } from '@nestjs/common';
import { BackgroundsService } from './backgrounds.service';

@Controller('backgrounds')
export class BackgroundsController {
  constructor(private readonly backgroundsService: BackgroundsService) {}

  @Post()
  async getOneRandomly(@Body() body): Promise<any> {
    return await this.backgroundsService.getRandomly(body);
  }

}
