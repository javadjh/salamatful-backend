import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { ReplyService } from './reply.service';

@Controller('reply')
export class ReplyController {
  constructor(private readonly replyService: ReplyService) { }
  @Get('/')
  async getReplies(@Res() res: Response, @Query() query) {
    res.json(await this.replyService.getAll(res.locals.userId, query.ticketId));
  }

  @Post('/')
  async createReply(@Body() body, @Res() res: Response) {
    res.json(await this.replyService.createOne(res.locals.userId, body));
  }
}
