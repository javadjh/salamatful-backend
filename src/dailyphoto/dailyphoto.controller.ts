import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { DailyphotoService } from './dailyphoto.service';

@Controller('dailyphoto')
export class DailyphotoController {
  constructor(private readonly dailyphotoService: DailyphotoService) { }

  @Get('/today')
  async getToday(@Res() res: Response) {
    res.json(await this.dailyphotoService.getToday(res.locals.userId));
  }

}
