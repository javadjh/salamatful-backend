import { Body, Controller, Post, Res } from "@nestjs/common";
import { LikeService } from "./like.service";
import { Response } from "express";

@Controller("like")
export class LikeController {
  constructor(private readonly likeService: LikeService) {
  }

  @Post("/create")
  async createRecord(@Body() body, @Res() res: Response): Promise<any> {
    await this.likeService.createLike(body, res.locals.userId);
  }
}
