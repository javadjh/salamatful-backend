import { Body, Controller, Post, Res } from "@nestjs/common";
import { RateService } from "./rate.service";
import { Response } from "express";

@Controller("rate")
export class RateController {
  constructor(private readonly rateService: RateService) {
  }

  @Post("/")
  async rate(@Res() res: Response, @Body() body) {
    res.json(await this.rateService.rateObject(res.locals.userId, body));
  }
}
