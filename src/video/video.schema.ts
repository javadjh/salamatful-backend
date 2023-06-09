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
    @Prop({ type: Array, default: [] })
    tags: Array<string>;
    @Prop()
    seen: boolean;
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
    @Prop()
    except: boolean;
    @Prop({ default: Date.now })
    cDate: Date;
    @Prop({ default: 0 })
    avgRate: number;
    @Prop({ default: 0 })
    sumRates: number;
    @Prop({ default: 0 })
    countRates: number;
}
export const VideoSchema = SchemaFactory.createForClass(Video);