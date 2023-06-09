import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import config from "src/config";
import { UserDocument } from "src/user/user.schema";
import { BlogDocument } from "./blog.schema";
import { PurchaseDocument } from "../purchase/purchase.schema";

@Injectable()
export class BlogService {
  constructor(
    @InjectModel("Blog") private blogModel: Model<BlogDocument>,
    @InjectModel("User") private userModel: Model<UserDocument>,
    @InjectModel("Purchase") private purchaseModel: Model<PurchaseDocument>
  ) {
  }

  async findBySlug(params, userId): Promise<any> {
    const { slug } = params;
    const user = userId ? await this.userModel.findById(userId, "sub") : null;
    const subscribed =
      user && user.sub && user.sub.getTime() >= new Date().getTime();
    const blog = await this.blogModel.findOne({ slug });
    if (blog) {
      if (blog.img) {
        blog.img.path = `${config.serverURL}${config.blogImages}/${blog.img.path}`;
      }
      if (blog.lock && subscribed) {
        blog.lock = false;
      }
      return blog;
    }
    throw new NotFoundException("Invalid Slug");
  }

  async getCategories(): Promise<any> {
    try {
      return await this.blogModel
        .find({ cats: { $ne: "" } }, "cats")
        .distinct("cats");
    } catch (error) {
      return { code: -1, message: "Error" };
    }
  }

  async getBlogs(params): Promise<any> {
    try {
      const blogs = await this.blogModel.find(
        { cats: params.category },
        "_id slug title author pDate img lock"
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
      return { code: -1, message: "Error" };
    }
  }

  async getEntireBlogs(): Promise<any> {
    try {
      return this.fixImagePaths(await this.blogModel.find({ lock: false }));
    } catch (error) {
      return { code: -1, message: "An error occurred" };
    }
  }

  async getSuggestedBlogs(limit: number, category: string): Promise<any> {
    try {
      return this.fixImagePaths(await this.blogModel.find({
        cats: category,
        lock: false
      }).sort({ _id: 1 }).limit(limit));
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async getRecentBlogs(limit: number): Promise<any> {
    try {
      return this.fixImagePaths(await this.blogModel.find({ lock: false }).sort({ _id: -1 }).limit(limit));
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async getAllBlogsWithCategory(userId: string) {
    try {
      let result = [];
      let allBlogs = await this.blogModel.find({}, "id slug courseId title lock cats img meta");
      let purchasedCourses = await this.purchaseModel.find({ userId: userId, to: { $lte: new Date() } }, "courseId");
      allBlogs = this.fixImagePaths(allBlogs);
      for (let blog of allBlogs) {
        if (blog.lock && blog.courseId) {
          if (purchasedCourses.map(purchase => purchase.courseId).indexOf(blog.courseId) >= 0) {
            blog.lock = false;
          }
        }
        const index = result.map(res => res.category).indexOf(blog.cats);
        if (index >= 0) {
          result[index].blogs.push(blog);
        } else {
          result.push({ category: blog.cats, blogs: [blog] });
        }
      }
      return result;
    } catch (error) {
      console.error(error);
      return { code: -1, message: "Error occurred" };
    }
  }

  fixImagePaths(blogs: Array<any>): any {
    for (const blog of blogs) {
      if (blog.img) {
        blog.img.path = `${config.serverURL}${config.blogImages}/${blog.img.path}`;
      }
    }
    return blogs;
  }
}
