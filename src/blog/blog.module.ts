import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogSchema } from './blog.schema';
import { UserSchema } from 'src/user/user.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: "Blog", schema: BlogSchema },
    { name: "User", schema: UserSchema },
  ])],
  controllers: [BlogController],
  providers: [BlogService]
})
export class BlogModule { }
