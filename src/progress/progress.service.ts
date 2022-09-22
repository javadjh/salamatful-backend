import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProgressDocument } from './progress.schema';

@Injectable()
export class ProgressService {
    constructor(
        @InjectModel('Progress') private progressModel: Model<ProgressDocument>,
    ) { }
    async createOne(body, uId): Promise<any> {
        try {
            const { oId, t } = body;
            if (oId && t && uId) {
                await this.progressModel.create({ uId, oId, t });
                return { code: 1, msg: 'Created' }
            } else {
                return { code: 0, msg: 'Some of the parameters have been missed' }
            }
        } catch (error) {
            return { code: -1, msg: 'An error occurred' }
        }
    }
}
