import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import config from "src/config";
import { WebBlogDocument } from "./webblog.schema";

@Injectable()
export class WebBlogService {
    constructor(
        @InjectModel("WebBlog") private webblogModel: Model<WebBlogDocument>,
    ) {
    }

    async findBySlug(params): Promise<any> {
        const { slug } = params;
        const blog = await this.webblogModel.findOne({ slug });
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
            const tags = await this.webblogModel
                .find({}, 'tags')
            for (let tag of tags) {
                for (let t of tag.tags) {
                    if (result.indexOf(t) == -1) result.push(t)
                }
            }
            return result;
        } catch (error) {
            return { code: -1, message: "Error" };
        }
    }

    async getBlogs(params): Promise<any> {
        try {
            const blogs = await this.webblogModel.find(
                { tags: { $in: [params.category] } },
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
            return this.fixImagePaths(await this.webblogModel.find({}, 'title img slug meta pDate'));
        } catch (error) {
            return { code: -1, message: "An error occurred" };
        }
    }

    async getSuggestedBlogs(limit: number, category: string): Promise<any> {
        try {
            return this.fixImagePaths(await this.webblogModel.find({ tags: { $in: [category] } }).sort({ _id: 1 }).limit(limit));
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
