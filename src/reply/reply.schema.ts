import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ReplyDocument = Reply & Document;
@Schema()
export class Reply {
    // message
    @Prop({ trim: true })
    msg: string;
    // ticket Id
    @Prop({ required: true })
    tId: string;
    // Date
    @Prop({ type: Date })
    at: Date;
    // is out going
    @Prop({ default: true })
    isOG: boolean;
}
export const ReplySchema = SchemaFactory.createForClass(Reply);
