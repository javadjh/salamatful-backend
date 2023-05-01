import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CategorySchema } from './category.schema';
import { CourseSchema } from 'src/course/course.schema';
import { PurchaseSchema } from 'src/purchase/purchase.schema';
import { UserSchema } from 'src/user/user.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: "Category", schema: CategorySchema },
    { name: "Course", schema: CourseSchema },
    { name: "Purchase", schema: PurchaseSchema },
    { name: "User", schema: UserSchema },
  ])],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule { }
