import { Controller, Get, Param } from '@nestjs/common';
import { StaticsService } from './statics.service';

@Controller('statics')
export class StaticsController {
  constructor(private readonly staticsService: StaticsService) { }
  @Get('/:slug')
  async findBySlug(@Param() params) {
    return await this.staticsService.getPageBySlug(params);
  }
}
