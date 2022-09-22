import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { CourseService } from './course.service';

@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}
  @Get('/:slug')
  async findById(@Param() params, @Res() res: Response): Promise<any> {
    res.json(await this.courseService.findBySlug(params, res.locals.userId));
  }

  @Post('/like')
  async like(@Body() body, @Res() res: Response): Promise<any> {
    res.json(await this.courseService.like(body, res.locals.userId));
  }
}
