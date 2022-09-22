import { Module } from '@nestjs/common';
import { ReplyService } from './reply.service';
import { ReplyController } from './reply.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ReplySchema } from './reply.schema';
import { TicketSchema } from 'src/ticket/ticket.schema';
import { UserSchema } from 'src/user/user.schema';

@Module({
  controllers: [ReplyController],
  providers: [ReplyService],
  imports: [MongooseModule.forFeature([
    { name: 'Reply', schema: ReplySchema },
    { name: 'Ticket', schema: TicketSchema },
    { name: 'User', schema: UserSchema },
  ])],
  exports: [
    MongooseModule.forFeature([{ name: 'Reply', schema: ReplySchema }]),
  ],
})
export class ReplyModule { }
