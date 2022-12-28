import { Module } from '@nestjs/common';
import { StoryService } from './story.service';
import { StoryController } from './story.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { StorySchema } from "./story.schema";
import { CategorySchema } from 'src/category/category.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: "Story", schema: StorySchema }, { name: "Category", schema: CategorySchema }])],
  controllers: [StoryController],
  providers: [StoryService]
})
export class StoryModule { }
