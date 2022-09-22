import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CourseSchema } from './course.schema';
import { UserSchema } from 'src/user/user.schema';
import { VideoSchema } from 'src/video/video.schema';
import { BlogSchema } from 'src/blog/blog.schema';
import { AudioSchema } from 'src/audio/audio.schema';
import { GallerySchema } from 'src/gallery/gallery.schema';
import { PurchaseSchema } from 'src/purchase/purchase.schema';
import {DynamicsSchema} from "../dynamics/dynamics.schema";

@Module({
  imports: [MongooseModule.forFeature([
    { name: "Course", schema: CourseSchema },
    { name: "User", schema: UserSchema },
    { name: "Video", schema: VideoSchema },
    { name: "Blog", schema: BlogSchema },
    { name: "Audio", schema: AudioSchema },
    { name: "Gallery", schema: GallerySchema },
    { name: "Purchase", schema: PurchaseSchema },
    { name: "Dynamics", schema: DynamicsSchema },
  ])],
  controllers: [CourseController],
  providers: [CourseService],
})
export class CourseModule { }
