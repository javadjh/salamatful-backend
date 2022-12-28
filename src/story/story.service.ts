import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StoryDocument } from './story.schema';
import config from 'src/config';

// const channelId = "b3a1cc60-eb7b-41d8-939a-c1e9fad6fc50";
// const authorization = "ee9e7a7a-120b-4851-a065-f04311a0e038";

@Injectable()
export class StoryService {
    constructor(@InjectModel("Story") private storyModel: Model<StoryDocument>, @InjectModel("Category") private categoryModel: Model<StoryDocument>) { }
    async findAll(): Promise<any> {
        try {
            var stories = await this.storyModel.find({ client: true });
            if (stories) {
                for (let story of stories) {
                    if (story.file) {
                        story.file.path = `${config.serverURL}${config.storyFiles}/${story.file.path}`;
                    }
                }
            }
            return stories;
        } catch (error) {
            return (error);
        }
    }
    async getStoryByCategory(params) {
        try {
            const { id } = params;
            const category = await this.categoryModel.findById(id);
            if (category) {
                const count_of_stories = await this.storyModel.find({ static: false }).count();
                const random = Math.floor(Math.random() * count_of_stories);
                let story = await this.storyModel.find({
                    static: false
                }, "url file desc").skip(random).limit(1);
                // @ts-ignore
                story = story[0]
                if (story['url']) {
                    return story;
                }
                story['url'] = `${config.serverURL}${config.storyFiles}/${story["file"].path}`;
                return story;
            }
        } catch (error) {

        }

    }

}
