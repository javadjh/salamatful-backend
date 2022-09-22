import { Module } from '@nestjs/common';
import { StoryService } from './story.service';
import { StoryController } from './story.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { StorySchema } from "./story.schema";

@Module({
  imports: [MongooseModule.forFeature([{ name: "Story", schema: StorySchema }])],
  controllers: [StoryController],
  providers: [StoryService]
})
export class StoryModule { }
