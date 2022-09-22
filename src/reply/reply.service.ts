import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import config from 'src/config';
import { TicketDocument } from 'src/ticket/ticket.schema';
import { UserDocument } from 'src/user/user.schema';
import { ReplyDocument } from './reply.schema';

@Injectable()
export class ReplyService {
    constructor(
        @InjectModel('Ticket') private ticketModel: Model<TicketDocument>,
        @InjectModel('Reply') private replyModel: Model<ReplyDocument>,
        @InjectModel('User') private userModel: Model<UserDocument>,
    ) { }

    async getAll(userId, ticketId): Promise<any> {
        try {
            if (userId && ticketId) {
                const ticket = await this.ticketModel.findById(ticketId);
                if (ticket) {
                    const result = [];
                    const replies = await this.replyModel.find({ tId: ticketId });
                    const user = await this.userModel.findById(userId, "bg");
                    let bg = '';
                    if (user && user.bg && user.bg.path) {
                        bg = `${config.serverURL}${config.profiles}/${user.bg.path}`;
                    }
                    replies.map(reply => {
                        result.push({ reply, bg });
                    })
                    return result;
                }
                return { code: 0, message: 'Ticket Id is incorrect' }
            }
            return { code: 0, message: 'Some parameters have been missed' }
        } catch (error) {
            return { code: -1, message: 'An error occurred.' }
        }
    }

    async createOne(userId, body): Promise<any> {
        try {
            if (userId) {
                const { msg, tId } = body;
                await this.replyModel.create({ msg, tId, at: new Date() });
                const result = [];
                const replies = await this.replyModel.find({ tId });
                const user = await this.userModel.findById(userId, "bg");
                let bg = '';
                if (user && user.bg && user.bg.path) {
                    bg = `${config.serverURL}${config.profiles}/${user.bg.path}`;
                }
                replies.map(reply => {
                    result.push({ reply, bg });
                })
                return result;
            }
            return { coed: 0, message: 'Insufficient data provided' }
        } catch (error) {
            return { code: -1, message: 'An error occurred' }
        }
    }
}
