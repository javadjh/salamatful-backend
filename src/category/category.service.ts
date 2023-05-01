import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import config from 'src/config';
import { CourseDocument } from 'src/course/course.schema';
import { PurchaseDocument } from 'src/purchase/purchase.schema';
import { CategoryDocument } from './category.schema';
import { UserDocument } from 'src/user/user.schema';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel('Category') private categoryModel: Model<CategoryDocument>,
    @InjectModel('Course') private courseModel: Model<CourseDocument>,
    @InjectModel('Purchase') private purchaseModel: Model<PurchaseDocument>,
    @InjectModel('User') private userModel: Model<UserDocument>,
  ) {}
  async findAll(): Promise<any> {
    try {
      const categories = await this.categoryModel.find(
        { client: true },
        '_id name icon slug',
      );
      if (categories) {
        // generate category icon image paths
        for (const category of categories) {
          if (category.icon) {
            category.icon.path = `${config.serverURL}${config.defaultImages}/${category.icon.path}`;
          }
        }
      }
      return categories;
    } catch (error) {
      return { code: -1, msg: error };
    }
  }

  async findBySlug(params, userId): Promise<any> {
    try {
      const category = await this.categoryModel.findOne({ slug: params.slug });
      if (category) {
        const courses = [];
        // generate category icon path
        if (category.icon) {
          category.icon.path = `${config.serverURL}${config.defaultImages}/${category.icon.path}`;
        }
        // generate category course images path
        if (category.course && category.course.length > 0) {
          for (let courseId of category.course) {
            let course = await this.courseModel.findById(
              courseId,
              '_id name bg likes slug meta',
            );
            const hasLikedBefore = await this.userModel.findOne({
              $and: [{ _id: userId }, { fav: { $elemMatch: { cId: courseId } } }]
            });
            if (course && course.bg) {
              course.bg.path = `${config.serverURL}${config.courseImages}/${course.bg.path}`;
            }
            courses.push({ ...course, liked: Boolean(hasLikedBefore) });
          }
        }
        // generate category carousel images path
        let index = 0;
        if (category.carousel && category.carousel.length > 0) {
          for (let carousel of category.carousel) {
            let carouselCourses = [];
            for (let courseId of carousel.courses) {
              let course = await this.courseModel.findById(
                courseId,
                '_id name bg slug meta',
              );
              const hasLikedBefore = await this.userModel.findOne({
                $and: [{ _id: userId }, { fav: { $elemMatch: { cId: courseId } } }]
              });
              if (course && course.bg) {
                course.bg.path = `${config.serverURL}${config.courseImages}/${course.bg.path}`;
              }
              carouselCourses.push({ ...course, liked: Boolean(hasLikedBefore) });
            }
            category.carousel[index].courses = carouselCourses;
            carouselCourses = [];
            index++;
          }
        }
        category.course = courses;
        return category;
      }
      return { code: -1, message: 'Invalid data' };
    } catch (error) {
      return { code: -1, message: error };
    }
  }
}
