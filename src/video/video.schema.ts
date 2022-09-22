import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
export type VideoDocument = Video & Document;
@Schema()
export class Video {
    @Prop()
    courseId: string;
    @Prop({ required: true })
    title: string;
    @Prop({ type: Object })
    file: {
        name: string,
        path: string,
        mime: string
    };
    @Prop({ type: Object })
    poster: {
        name: string,
        path: string,
        mime: string
    };
    @Prop()
    url: string;
    @Prop({ default: 0 })
    length: number;
    @Prop({ trim: true })
    type: string;
    @Prop()
    lock: Boolean;
    @Prop()
    category: string;
    @Prop({ default: Date.now })
    cDate: Date;
}
export const VideoSchema = SchemaFactory.createForClass(Video);