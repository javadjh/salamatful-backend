import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { MessagesDocument, MessagesSchema } from './message.schema';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';

@Module({
  controllers: [MessageController],
  providers: [MessageService],
  imports: [
    MongooseModule.forFeature([{ name: 'Message', schema: MessagesSchema }]),
  ],
})
export class MessageModule {}
