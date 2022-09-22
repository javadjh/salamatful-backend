import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProgressDocument = Progress & Document;
@Schema()
export class Progress {
    // type of document
    @Prop()
    t: string;
    // user Id
    @Prop()
    uId: string;
    // object Id
    @Prop()
    oId: string;
}
export const ProgressSchema = SchemaFactory.createForClass(Progress);
