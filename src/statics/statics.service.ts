import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StaticsDocument } from './statics.schema';

@Injectable()
export class StaticsService {
  constructor(
    @InjectModel('Statics') private staticsModel: Model<StaticsDocument>,
  ) {}

  async getPageBySlug(params) {
    try {
      const { slug } = params;
      if (slug) {
        return await this.staticsModel.findOne({ slug, client: true });
      }
      return { code: -1, msg: 'No slug provided.' };
    } catch (error) {
      return { code: -1, msg: 'Error occurred.' };
    }
  }
}
