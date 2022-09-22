import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type StoryDocument = Story & Document;
@Schema()
export class Story {
    @Prop()
    desc: string;
    @Prop({ type: Object })
    file: {
        name: string,
        path: string,
        mime: string
    };
    @Prop()
    url: string;
    @Prop()
    client: Boolean;
    @Prop({ default: new Date() })
    cDate: Date;
}
export const StorySchema = SchemaFactory.createForClass(Story);