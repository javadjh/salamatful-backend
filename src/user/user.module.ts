import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserSchema } from './user.schema';
import { tokenSchema } from 'src/token/token.schema';
import { CourseSchema } from 'src/course/course.schema';
import { TempUserSchema } from './tempUser.schema';
import { ProgressSchema } from 'src/progress/progress.schema';
import { AudioSchema } from 'src/audio/audio.schema';
import { VideoSchema } from 'src/video/video.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Token', schema: tokenSchema },
      { name: 'TempUser', schema: TempUserSchema },
      { name: 'Course', schema: CourseSchema },
      { name: 'Progress', schema: ProgressSchema },
      { name: 'Audio', schema: AudioSchema },
      { name: 'Video', schema: VideoSchema },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
