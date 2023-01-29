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
    @Prop()
    category: String;
    @Prop()
    static: Boolean;
}
export const StorySchema = SchemaFactory.createForClass(Story);