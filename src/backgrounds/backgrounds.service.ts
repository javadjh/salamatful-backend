import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import config from 'src/config';
import { BackgroundDocument } from './backgrounds.schema';

@Injectable()
export class BackgroundsService {
    constructor(
        @InjectModel("Background") private backgroundModel: Model<BackgroundDocument>,
    ) { }
    async getRandomly(body): Promise<any> {
        try {
            const { type, time } = body;
            if (type && time) {
                const bgs = await this.backgroundModel.find({ $and: [{ types: { $in: type } }, { times: { $in: time } }] }, "file url");
                const index = Math.floor(Math.random() * bgs.length);
                const bg = bgs[index];
                if (bg && bg.file) {
                    bg.file.path = `${config.serverURL}${config.backgrounds}/${bg.file.path}`;
                }
                return bg;
            } else {
                return { code: 0, message: "Some of the parameters have been missed (type or time)" }
            }
        } catch (error) {
            return { code: -1, message: "Error occurred while getting a random background" }
        }
    }
}
