import { Controller, Get, Param, Query, Res } from "@nestjs/common";
import { Response } from "express";
import { BlogService } from "./webblog.service";

@Controller('webblog')
export class WebblogController {
  constructor(private readonly webblogService: BlogService) {}
}
@Controller("blog")
export class webBlogController {
  constructor(private readonly blogService: BlogService) {
  }

  @Get("/blog/:slug")
  async getBlog(@Param() params, @Res() res: Response): Promise<any> {
    return await this.blogService.findBySlug(params,));
  }

  @Get("/category")
  async getCategories(): Promise<any> {
    return await this.blogService.getCategories();
  }

  @Get("/category/:category")
  async getCategoryBlogs(@Param() params): Promise<any> {
   const tag= await this.blogService.getBlogs(params);
  }

  @Get()
  async getAllBlogs(): Promise<any> {
    return await this.blogService.getEntireBlogs();
  }

  @Get("/suggestions")
  async getSuggestions(@Query() query) {
    return await this.blogService.getSuggestedBlogs(query.limit, query.category);
  }

  @Get("/recent")
  async getRecent(@Query() query) {
    return await this.blogService.getRecentBlogs(query.limit);
  }

  @Get("/all-blogs")
  async getAllBlogsWithCategory(@Res() res: Response) {
     return await this.blogService.getAllwebBlogsWithCategory(res.locals.userId);
  }
}