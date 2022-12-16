import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AudioDocument } from 'src/audio/audio.schema';
import { Blog, BlogDocument } from 'src/blog/blog.schema';
import { CourseDocument } from 'src/course/course.schema';
import { VideoDocument } from 'src/video/video.schema';
import { RateDocument } from './rate.schema';

@Injectable()
export class RateService {
    constructor(
        @InjectModel("Rate") private rateModel: Model<RateDocument>,
        @InjectModel("Blog") private blogModel: Model<BlogDocument>,
        @InjectModel("Audio") private audioModel: Model<AudioDocument>,
        @InjectModel("Video") private videoModel: Model<VideoDocument>,
        @InjectModel("Course") private courseModel: Model<CourseDocument>,

    ) {
    }
    async rateObject(userId, body) {
        try {
            let { objectId, objectType, rate } = body;
            if (userId) {
                const recordExists = await this.rateModel.findOne({ $and: [{ uId: userId }, { objId: objectId }, { t: objectType }] });
                if (recordExists) {
                    await this.rateModel.updateOne({ id: recordExists.id }, { r: rate });
                    if (objectType == "blog") {
                        const blog = await this.blogModel.findOne({ id: objectId })
                        let { sumRates, countRates } = blog
                        sumRates = sumRates - recordExists.r + rate
                        let avgRate = sumRates / countRates
                        await this.blogModel.updateOne({ id: objectId }, { avgRate: avgRate, sumRates: sumRates })
                    }
                    else if (objectType == "audio") {
                        const audio = await this.audioModel.findOne({ id: objectId })
                        let { sumRates, countRates } = audio
                        sumRates = sumRates - recordExists.r + rate
                        let avgRate = sumRates / countRates
                        await this.audioModel.updateOne({ id: objectId }, { avgRate: avgRate, sumRates: sumRates })
                    }
                    else if (objectType == "video") {
                        const video = await this.videoModel.findOne({ id: objectId })
                        let { sumRates, countRates } = video
                        sumRates = sumRates - recordExists.r + rate
                        let avgRate = sumRates / countRates
                        await this.videoModel.updateOne({ id: objectId }, { avgRate: avgRate, sumRates: sumRates })
                    }
                    else if (objectType == "course") {
                        const course = await this.courseModel.findOne({ id: objectId })
                        let { sumRates, countRates } = course
                        sumRates = sumRates - recordExists.r + rate
                        let avgRate = sumRates / countRates
                        await this.courseModel.updateOne({ id: objectId }, { avgRate: avgRate, sumRates: sumRates })
                    }
                    return { code: 1, message: 'rate updated' }
                } else {
                    await this.rateModel.create({ uId: userId, t: objectType, objId: objectId, r: rate });
                    if (objectType == "blog") {
                        const blog = await this.blogModel.findOne({ id: objectId })
                        let { sumRates, countRates } = blog
                        sumRates = sumRates + rate
                        countRates += 1
                        let avgRate = sumRates / countRates
                        await this.blogModel.updateOne({ id: objectId }, { avgRate: avgRate, sumRates: sumRates, countRates: countRates })
                    }
                    else if (objectType == "audio") {
                        const audio = await this.audioModel.findOne({ id: objectId })
                        let { sumRates, countRates } = audio
                        sumRates = sumRates + rate
                        countRates += 1
                        let avgRate = sumRates / countRates
                        await this.audioModel.updateOne({ id: objectId }, { avgRate: avgRate, sumRates: sumRates, countRates: countRates })
                    }
                    else if (objectType == "video") {
                        const video = await this.videoModel.findOne({ id: objectId })
                        let { sumRates, countRates } = video
                        sumRates = sumRates + rate
                        countRates += 1
                        let avgRate = sumRates / countRates
                        await this.videoModel.updateOne({ id: objectId }, { avgRate: avgRate, sumRates: sumRates, countRates: countRates })
                    }
                    else if (objectType == "course") {
                        const course = await this.courseModel.findOne({ id: objectId })
                        let { sumRates, countRates } = course
                        sumRates = sumRates + rate
                        countRates += 1
                        let avgRate = sumRates / countRates
                        await this.courseModel.updateOne({ id: objectId }, { avgRate: avgRate, sumRates: sumRates, countRates: countRates })
                    }
                    return { code: 1, message: 'rate created' }
                }
            }
            return { code: 0, message: 'some of the fields have been missed' }
        } catch (error) {
            console.error(error)
            return { code: -1, message: 'error occurred' }
        }
    }
}
