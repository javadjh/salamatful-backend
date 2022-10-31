import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AudioDocument } from "src/audio/audio.schema";
import { BlogDocument } from "src/blog/blog.schema";
import config from "src/config";
import { GalleryDocument } from "src/gallery/gallery.schema";
import { PurchaseDocument } from "src/purchase/purchase.schema";
import { UserDocument } from "src/user/user.schema";
import { VideoDocument } from "src/video/video.schema";
import { CourseDocument } from "./course.schema";
import { DynamicsDocument } from "../dynamics/dynamics.schema";
import { ProgressDocument } from "../progress/progress.schema";

@Injectable()
export class CourseService {
  constructor(
    @InjectModel("Course") private courseModel: Model<CourseDocument>,
    @InjectModel("User") private userModel: Model<UserDocument>,
    @InjectModel("Video") private videoModel: Model<VideoDocument>,
    @InjectModel("Blog") private blogModel: Model<BlogDocument>,
    @InjectModel("Audio") private audioModel: Model<AudioDocument>,
    @InjectModel("Gallery") private galleryModel: Model<GalleryDocument>,
    @InjectModel("Purchase") private purchaseModel: Model<PurchaseDocument>,
    @InjectModel("Dynamics") private dynamicsModel: Model<DynamicsDocument>,
    @InjectModel("Progress") private progressModel: Model<ProgressDocument>,
  ) {
  }

  async findBySlug(params, userId): Promise<any> {
    try {
      const { slug } = params;
      let videoCategories = [];
      const course = await this.courseModel.findOne({ slug });
      const user = userId ? await this.userModel.findById(userId, "sub") : null;
      let galleries = [];
      const subscribed =
        user && user.sub && user.sub.getTime() >= new Date().getTime();
      let audios, videos, blogs;
      let audiosInOrder = [];
      if (course) {
        if (course.hasAccess) {
          const hasAccess = await this.purchaseModel.findOne({ userId: userId, courseId: course.id });
          if (!hasAccess) return { code: -1, message: "Access denied" };
        }
        if (course.bg) {
          course.bg.path = `${config.serverURL}${config.courseImages}/${course.bg.path}`;
        }
        if (course.audioBg) {
          course.audioBg.path = `${config.serverURL}${config.courseImages}/${course.audioBg.path}`;
        }
        if (course.videoBg) {
          course.videoBg.path = `${config.serverURL}${config.courseImages}/${course.videoBg.path}`;
        }
        galleries = await this.galleryModel.find({ cId: course.id });
        for (const gallery of galleries) {
          if (gallery && gallery.imgs) {
            for (const img of gallery.imgs) {
              img.path = `${config.serverURL}${config.galleryImages}/${img.path}`;
            }
          }
          if (gallery.lock && subscribed) {
            gallery.lock = false;
          }
        }
        audios = course.audios;
        for (let audio of audios) {
          audio = audio && await this.audioModel.findById(audio);
          if (audio) {
            if (audio.file) {
              audio.file.path = `${config.serverURL}${config.defaultImages}/${audio.file.path}`;
            }
            if (audio.lock && subscribed) {
              audio.lock = false;
            }
            const hasProgress = await this.progressModel.findOne({ uId: userId, oId: audio.id });
            if (hasProgress) {
              audio.seen = true;
            }
            audiosInOrder.push(audio);
          }
        }
        videos = course.videos;
        for (let video of videos) {
          video = video && await this.videoModel.findById(video);
          if (video) {
            if (video.file) {
              video.file.path = `${config.serverURL}${config.defaultImages}/${video.file.path}`;
            }
            if (video.poster) {
              video.poster.path = `${config.serverURL}${config.defaultImages}/${video.poster.path}`;
            }
            if (video.lock && subscribed) {
              video.lock = false;
            }
            const hasProgress = await this.progressModel.findOne({ uId: userId, oId: video.id });
            if (hasProgress) {
              video.seen = true;
            }
            if (video.category) {
              const index = videoCategories.map(cat => cat.categoryName).indexOf(video.category);
              if (index >= 0) {
                videoCategories[index].videos.push(video);
              } else {
                videoCategories = [...videoCategories, { categoryName: video.category, videos: [video] }];
              }
            }
          }
        }
        blogs = await this.blogModel.find(
          { courseId: course.id },
          "_id title category lock img slug"
        );
        blogs.map((blog) => {
          if (blog && blog.img) {
            blog.img.path = `${config.serverURL}${config.blogImages}/${blog.img.path}`;
          }
          if (blog && blog.lock && subscribed) {
            blog.lock = false;
          }
        });
      }
      return { course, audios: audiosInOrder, videos: videoCategories, blogs, galleries };
    } catch (error) {
      console.error(error);
      return { code: -1, message: "Error occurred" };
    }
  }

  async like(body: { courseId: string }, userId: string): Promise<any> {
    try {
      const { courseId } = body;
      const user = await this.userModel.findById(userId);
      const course = await this.courseModel.findById(courseId, "_id name bg");
      if (user && course) {
        const hasLikedBefore = await this.userModel.findOne({
          $and: [{ _id: userId }, { fav: { $elemMatch: { cId: courseId } } }]
        });
        if (hasLikedBefore) {
          // delete the like record from the user model
          await this.userModel.updateOne(
            { _id: userId },
            { $pull: { fav: { cId: courseId } } }
          );
          // delete the like record from the course model
          await this.courseModel.updateOne(
            { _id: courseId },
            { $inc: { likes: -1 } }
          );
          return { code: 1, message: "Action performed", data: false };
        }
        // like the course in user model
        await this.userModel.updateOne(
          { _id: userId },
          {
            $push: {
              fav: {
                cId: courseId,
                name: course.name,
                bg:
                  course.bg &&
                  `${config.serverURL}${config.defaultImages}/${course.bg.path}`
              }
            }
          }
        );
        // like the course in course model
        await this.courseModel.updateOne(
          { _id: courseId },
          { $inc: { likes: 1 } }
        );
        return { code: 1, message: "Action performed", data: true };
      }
      return { code: 0, message: "No match found" };
    } catch (error) {
      return { code: -1, message: "An Error Occurrred" };
    }
  }
}
