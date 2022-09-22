import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import config from 'src/config';
import { UserDocument } from 'src/user/user.schema';
import { DailyPhotoDocument } from './dailyphoto.schema';

@Injectable()
export class DailyphotoService {
    constructor(
        @InjectModel('User') private user: Model<UserDocument>,
        @InjectModel('DailyPhoto') private dailyPhoto: Model<DailyPhotoDocument>,
    ) { }

    async getToday(userId): Promise<any> {
        try {
            let today = await this.dailyPhoto.findOne();
            let user = await this.user.findById(userId, "_id sub");
            if (today.img) {
                today.img.path = `${config.serverURL}${config.dailyPhoto}/${today.img.path}`;
            }
            if (today.lock && user && user.sub > new Date()) {
                today.lock = false;
            }
            return today;
        } catch (error) {
            return { code: -1, msg: "Error occurred while getting today's image" }
        }
    }
}
