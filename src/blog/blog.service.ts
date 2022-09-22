import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import config from 'src/config';
import { UserDocument } from 'src/user/user.schema';
import { BlogDocument } from './blog.schema';

@Injectable()
export class BlogService {
  constructor(
    @InjectModel('Blog') private blogModel: Model<BlogDocument>,
    @InjectModel('User') private userModel: Model<UserDocument>,
  ) {}

  async findBySlug(params, userId): Promise<any> {
    try {
      const { slug } = params;
      const user = userId ? await this.userModel.findById(userId, 'sub') : null;
      const subscribed =
        user && user.sub && user.sub.getTime() >= new Date().getTime();
      const blog = await this.blogModel.findOne({ slug });
      if (blog && blog.img) {
        blog.img.path = `${config.serverURL}${config.blogImages}/${blog.img.path}`;
      }
      if (blog.lock && subscribed) {
        blog.lock = false;
      }
      return blog;
    } catch (error) {
      return { code: -1, message: 'Error' };
    }
  }

  async getCategories(): Promise<any> {
    try {
      return await this.blogModel
        .find({ cats: { $ne: '' } }, 'cats')
        .distinct('cats');
    } catch (error) {
      return { code: -1, message: 'Error' };
    }
  }

  async getBlogs(params): Promise<any> {
    try {
      const blogs = await this.blogModel.find(
        { cats: params.category },
        '_id slug title author pDate img lock',
      );
      if (blogs) {
        for (const blog of blogs) {
          if (blog.img) {
            blog.img.path = `${config.serverURL}${config.blogImages}/${blog.img.path}`;
          }
        }
      }
      return blogs;
    } catch (error) {
      return { code: -1, message: 'Error' };
    }
  }
}
