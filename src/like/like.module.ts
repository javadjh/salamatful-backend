import { Module } from '@nestjs/common';
import { LikeService } from './like.service';
import { LikeController } from './like.controller';
import { MongooseModule } from "@nestjs/mongoose";
import { CourseSchema } from "../course/course.schema";
import { AudioSchema } from "../audio/audio.schema";
import { VideoSchema } from "../video/video.schema";
import { LikeSchema } from "./like.schema";

@Module({
  controllers: [LikeController],
  providers: [LikeService],
  imports: [
    MongooseModule.forFeature([
      { name: 'Like', schema: LikeSchema },
      { name: 'Video', schema: VideoSchema },
      { name: 'Audio', schema: AudioSchema },
      { name: 'Course', schema: CourseSchema },
    ])],
})
export class LikeModule {}
