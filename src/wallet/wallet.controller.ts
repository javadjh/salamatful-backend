import { Body, Controller, Get, Post, Put, Res } from "@nestjs/common";
import { Response } from "express";
import { WalletService } from "./wallet.service";

@Controller("wallet")
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post("/create")
  async createWallet(@Res() res: Response, @Body() body) {
    return res.json(
      await this.walletService.createWallet(res.locals.userId, body)
    );
  }

  @Put("/update")
  async updateWallet(@Res() res: Response, @Body() body) {
    return res.json(
      await this.walletService.updateCardNumber(res.locals.userId, body)
    );
  }

  @Get("/info")
  async getInfo(@Res() res: Response): Promise<any> {
    res.json(await this.walletService.getInfo(res.locals.userId));
  }

  @Get("/plans")
  async getPlans(@Res() res: Response) {
    res.json(await this.walletService.getPlan(res.locals.userId));
  }

  @Post("/redeem")
  async redeemCash(@Res() res: Response, @Body() body) {
    res.json(await this.walletService.redeem(res.locals.userId, body));
  }
}
