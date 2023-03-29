import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userServices: UserService) {}
  @Post()
  async createAccount(@Body() body): Promise<any> {
    return await this.userServices.createAccount(body);
  }

  @Post('/verifycode')
  async verifyCode(@Body() body): Promise<any> {
    return await this.userServices.verifyCode(body);
  }

  @Post('/verifyphone')
  async verifyPhone(@Body() body): Promise<any> {
    return await this.userServices.verifyPhone(body);
  }

  @Post('/signin')
  async signin(@Body() body): Promise<any> {
    return await this.userServices.signIn(body);
  }

  @Get('/profile')
  async getUser(@Res() res: Response): Promise<any> {
    res.json(await this.userServices.getUser(res.locals.userId));
  }

  @Put('/avatar')
  // @UseInterceptors(FileInterceptor('bg'))
  async updateAvatar(@Res() res: Response, @Body() body): Promise<any> {
    res.json(await this.userServices.updateAvatar(res.locals.userId, body));
  }

  @Put('/name')
  async updateName(@Res() res: Response, @Body() body): Promise<any> {
    res.json(await this.userServices.updateName(res.locals.userId, body));
  }

  @Get('/favorite/course')
  async getFavoriteCourses(@Res() res: Response): Promise<any> {
    res.json(await this.userServices.getFavoriteCourses(res.locals.userId));
  }

  @Post('/like/check/course')
  async checkLikeCourse(@Body() body, @Res() res: Response): Promise<any> {
    res.json(await this.userServices.checkCourseLiked(body, res.locals.userId));
  }

  @Get('/verifysub')
  async verifySubscription(@Res() res: Response): Promise<any> {
    res.json(await this.userServices.verifySubscription(res.locals.userId));
  }

  @Get('/logout')
  async logoutUser(@Res() res: Response): Promise<any> {
    res.json(await this.userServices.logout(res.locals.userId));
  }

  @Post('/validatephone')
  validatePhone(@Body() body): any {
    return this.userServices.validatePhone(body.phone);
  }
}
