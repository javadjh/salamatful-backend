import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { query, Response } from 'express';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) { }
  // send authority code to the client side
  @Post('/charge')
  async charge(@Body() body, @Res() res: Response): Promise<any> {
    res.json(
      await this.paymentService.getAuthorityCode(body, res.locals.userId),
    );
  }
  @Get('/check')
  async checkTransaction(@Query() query: { Authority: string; Status: string }, @Res() res: Response): Promise<any> {
    res.json(
      await this.paymentService.checkTransaction(query, res),
    );
  }
}
