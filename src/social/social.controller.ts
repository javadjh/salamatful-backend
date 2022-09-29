import { Body, Controller, Get, Post } from "@nestjs/common";
import { SocialService } from "./social.service";

@Controller("social")
export class SocialController {
  constructor(private readonly socialService: SocialService) {
  }

  @Get()
  async getAllSocialConnections() {
    return await this.socialService.getAllSocialConnections();
  }

  @Post()
  async createSocial(@Body() body) {
    return await this.socialService.createSocial(body);
  }
}
