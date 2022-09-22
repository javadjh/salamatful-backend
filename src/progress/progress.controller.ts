import { Body, Controller, Post, Res } from '@nestjs/common';
import { ProgressService } from './progress.service';

@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) { }
  @Post()
  async createOne(@Body() body, @Res() res) {
    res.json(await this.progressService.createOne(body, res.locals.userId));
  }
}
