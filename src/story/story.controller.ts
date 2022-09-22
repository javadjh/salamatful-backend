import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { StoryService } from './story.service';

@Controller('story')
export class StoryController {
  constructor(private readonly storyService: StoryService) { }
  @Get()
  async findAll(): Promise<any> {
    return await this.storyService.findAll();
  }
}
