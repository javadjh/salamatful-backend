import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
export type AudioDocument = Audio & Document;
@Schema()
export class Audio {
    @Prop()
    courseId: string;
    @Prop({ required: true })
    title: string;
    @Prop()
    ending: string;
    @Prop({ type: Object })
    file: {
        name: string,
        path: string,
        mime: string
    };
    @Prop()
    url: string;
    @Prop()
    openInNewTab: Boolean;
    @Prop({ default: 0 })
    length: number;
    @Prop()
    lock: Boolean;
    @Prop({ trim: true })
    type: string;
    @Prop()
    except: boolean;
    @Prop()
    seen: boolean;
    @Prop({ default: Date.now })
    cDate: Date;
}
export const AudioSchema = SchemaFactory.createForClass(Audio);