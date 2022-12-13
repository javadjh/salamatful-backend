import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RateDocument } from './rate.schema';

@Injectable()
export class RateService {
    constructor(
        @InjectModel("Rate") private rateModel: Model<RateDocument>
    ) {
    }
    async rateObject(userId, body) {
        try {
            let { objectId, objectType, rate } = body;
            if (userId) {
                const recordExists = await this.rateModel.findOne({ $and: [{ uId: userId }, { objId: objectId }, { t: objectType }] });
                if (recordExists) {
                    await this.rateModel.updateOne({ id: recordExists.id }, { r: rate });
                    return { code: 1, message: 'rate updated' }
                } else {
                    await this.rateModel.create({ uId: userId, t: objectType, objId: objectId, r: rate });
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
