import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { BlogService } from './blog.service';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) { }

  @Get('/blog/:slug')
  async getBlog(@Param() params, @Res() res: Response): Promise<any> {
    res.json(await this.blogService.findBySlug(params, res.locals.userId));
  }

  @Get('/category')
  async getCategories(): Promise<any> {
    return await this.blogService.getCategories();
  }

  @Get('/category/:category')
  async getCategoryBlogs(@Param() params): Promise<any> {
    return await this.blogService.getBlogs(params);
  }

  @Get()
  async getAllBlogs(): Promise<any> {
    return await this.blogService.getEntireBlogs();
  }
}
