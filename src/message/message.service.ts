import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MessagesDocument } from './message.schema';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel('Message') private messageModel: Model<MessagesDocument>,
  ) {}
  async getAll(): Promise<any> {
    try {
      return await this.messageModel.find();
    } catch (error) {
      return { code: -1, msg: 'Error occurred.' };
    }
  }
}
