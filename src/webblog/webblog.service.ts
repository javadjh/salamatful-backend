import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import config from "src/config";
import { WebBlogDocument } from "./webblog.schema";

@Injectable()
export class WebBlogService {
    constructor(
        @InjectModel("WebBlog") private blogModel: Model<WebBlogDocument>,
    ) {
    }

    async findBySlug(params): Promise<any> {
        const { slug } = params;
        const blog = await this.blogModel.findOne({ slug });
        if (blog) {
            if (blog.img) {
                blog.img.path = `${config.serverURL}${config.blogImages}/${blog.img.path}`;
            }
            return blog;
        }
        throw new NotFoundException("Invalid Slug");
    }

    async getCategories(): Promise<any> {
        try {
            let result = []
            const tags = await this.blogModel
                .find({}, 'tags')
            for (let tag of tags) {
                for (let t of tag.tags) {
                    if (result.indexOf(t) == -1) result.push(t)
                }
            } return result
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

