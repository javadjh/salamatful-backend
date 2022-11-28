import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class WebBlog {
  @Prop({ required: true, trim: true })
  title: string;
  @Prop()
  slug: string;
  @Prop({ trim: true })
  author: string;
  @Prop()
  desc: string;
  @Prop()
  meta: string;
  @Prop({ default: new Date() })
  pDate: Date;
  @Prop({ default: [] })
  tags: [string];
  @Prop({ type: Object })
  img: {
    name: string;
    path: string;
    mime: string;
  };
  @Prop({ default: false })
  lock: boolean;
  @Prop({ default: new Date() })
  cDate: Date;
}

export type WebBlogDocument = WebBlog & Document;
export const WebBlogSchema = SchemaFactory.createForClass(WebBlog);
