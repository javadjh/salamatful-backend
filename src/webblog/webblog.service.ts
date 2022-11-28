import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import config from "src/config";
import { UserDocument } from "src/user/user.schema";
import { WebBlogDocument } from "./webBlog.schema";
import { PurchaseDocument } from "../purchase/purchase.schema";

@Injectable()
export class BlogService {
    constructor(
        @InjectModel("WebBlog") private webblogModel: Model<WebBlogDocument>,

    ) {
    }

    async findBySlug(params, userId): Promise<any> {
        const { slug } = params;
        const user = userId ? await this.userModel.findById(userId, "sub") : null;
        const subscribed =
            user && user.sub && user.sub.getTime() >= new Date().getTime();
        const blog = await this.webblogModel.findOne({ slug });
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
            return await this.webblogModel
                .find({}, 'tags')
        } catch (error) {
            return { code: -1, message: "Error" };
        }
    }

    async getBlogs(params): Promise<any> {
        try {
            const blogs = await this.webblogModel.find(
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
            return this.fixImagePaths(await this.webblogModel.find({}, 'title slug meta pDate'));
        } catch (error) {
            return { code: -1, message: "An error occurred" };
        }
    }

    async getSuggestedBlogs(limit: number, category: string): Promise<any> {
        try {
            return this.fixImagePaths(await this.webblogModel.find({
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
            return this.fixImagePaths(await this.webblogModel.find({}).sort({ _id: -1 }).limit(limit));
        } catch (error) {
            console.error(error);
            return [];
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
