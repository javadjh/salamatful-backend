import { Controller, Get, Param, Query } from '@nestjs/common';
import { response } from 'express';
import { WebBlogService } from './webblog.service'
@Controller('webblog')
export class WebblogController {
  constructor(private readonly webblogService: WebblogService) {}

  @Get("/webblog/:slug")
  async getWebblog(@Param() params,): Promise<any> {
    return await this.webblogService.findBySlug(params);
  }

  @Get("/category")
  async getCategories(): Promise<any> {
    return await this.webblogService.getCategories();
  }

  @Get("/category/:category")
  async getCategoryBlogs(@Param() params): Promise<any> {
    return await this.webblogService.getBlogs(params);
  }

  @Get()
  async getAllBlogs(): Promise<any> {
    return await this.webblogService.getEntireBlogs();
  }

  @Get("/suggestions")
  async getSuggestions(@Query() query) {
    return await this.webblogService.getSuggestedBlogs(query.limit, query.category);
  }

  @Get("/recent")
  async getRecent(@Query() query) {
    return await this.blogService.getRecentBlogs(query.limit);
  }

  @Get("/all-blogs")
  async getAllBlogsWithCategory() {
   return await this.webblogService.getAllBlogsWithCategory(res.locals.userId);
  }
}