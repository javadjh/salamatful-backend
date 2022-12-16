import { Module } from '@nestjs/common';
import { RateService } from './rate.service';
import { RateController } from './rate.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RateSchema } from './rate.schema';
import { BlogSchema } from 'src/blog/blog.schema';
import { AudioSchema } from 'src/audio/audio.schema';
import { VideoSchema } from 'src/video/video.schema';
import { CourseSchema } from 'src/course/course.schema';

@Module({
  controllers: [RateController],
  providers: [RateService],
  imports: [
    MongooseModule.forFeature([
      { name: 'Rate', schema: RateSchema },
      { name: 'Blog', schema: BlogSchema },
      { name: 'Audio', schema: AudioSchema },
      { name: 'Video', schema: VideoSchema },
      { name: 'Course', schema: CourseSchema },
    ])],
})
export class RateModule {}
