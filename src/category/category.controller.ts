import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { CategoryService } from './category.service';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @Get()
  async getAll(): Promise<any> {
    return await this.categoryService.findAll();
  }

  @Get("/:slug")
  async getOne(@Param() params, @Res() res): Promise<any> {
    res.json(await this.categoryService.findBySlug(params, res.locals.userId));
  }
}