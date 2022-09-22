import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PriceDocument } from './price.schema';

@Injectable()
export class PriceService {
    constructor(
        @InjectModel('Price') private priceModel: Model<PriceDocument>,
    ) { }
    async getAll(): Promise<any> {
        try {
            return await this.priceModel.find();
        } catch (error) {
            return { code: -1, msg: 'Error occurred.' };
        }
    }
}
