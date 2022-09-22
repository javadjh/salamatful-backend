import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TicketSchema } from './ticket.schema';
import { UserSchema } from 'src/user/user.schema';
import { ReplySchema } from 'src/reply/reply.schema';

@Module({
  controllers: [TicketController],
  providers: [TicketService],
  imports: [
    MongooseModule.forFeature([{ name: 'Ticket', schema: TicketSchema }]),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'Reply', schema: ReplySchema }]),
  ],
  exports: [
    MongooseModule.forFeature([{ name: 'Ticket', schema: TicketSchema }]),
  ],
})
export class TicketModule {}
