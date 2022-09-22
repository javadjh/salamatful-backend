import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ReplyDocument } from 'src/reply/reply.schema';
import { UserDocument } from 'src/user/user.schema';
import { TicketDocument } from './ticket.schema';

@Injectable()
export class TicketService {
  constructor(
    @InjectModel('Ticket') private ticketModel: Model<TicketDocument>,
    @InjectModel('User') private userModel: Model<UserDocument>,
    @InjectModel('Reply') private replyModel: Model<ReplyDocument>,
  ) { }

  async newTicket(userId, body) {
    try {
      if (userId) {
        const ticket = await this.ticketModel.create({ title: body.title, userId, at: new Date() });
        const message = await this.replyModel.create({ msg: body.q, tId: ticket._id, at: new Date() });
        return { code: 1, message: 'Ticket created', data: message };
      }
      return { code: -1, msg: 'Invalid token.' };
    } catch (error) {
      return { code: -1, msg: 'Error occurred while creating new ticket.' };
    }
  }

  async getTickets(userId) {
    try {
      if (userId) {
        return await this.ticketModel.find({ userId });
      }
      return { code: 0, msg: 'Some of the paramters have been missed' }
    } catch (error) {
      return { code: -1, msg: 'Error occurred while getting tickets' };
    }
  }
}
