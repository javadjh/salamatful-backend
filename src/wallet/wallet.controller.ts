import { Controller, Get, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { WalletService } from './wallet.service';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) { }

  @Get('/info')
  async getInfo(@Res() res: Response): Promise<any> {
    return await this.walletService.getInfo(res.locals.userId);
  }

  @Get('/plan')
  async gotToPlan(@Res() res: Response) {
    return await this.walletService.getPlan(res.locals.userId);
  }

  @Post('/redeem')
  async redeemCash(@Res() res: Response) {

  }
}
