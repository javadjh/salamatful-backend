import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
export type CourseDocument = Course & Document;
@Schema()
export class Course {
  @Prop({ required: true })
  name: string;
  @Prop()
  slug: string;
  @Prop({ type: Object })
  bg: {
    name: string;
    path: string;
    mime: string;
  };
  @Prop({ type: [String] })
  courses: Array<string>;
  @Prop({ type: [String] })
  videos: Array<string>;
  @Prop({ type: [String], default: [] })
  audios: Array<String>;
  @Prop({ default: false })
  audiosInList: boolean;
  @Prop({ default: false })
  videosInList: boolean;
  @Prop({ default: false })
  hasAccess: boolean;
  @Prop()
  desc: string;
  @Prop({ default: 0 })
  likes: number;
  @Prop({ default: new Date() })
  cDate: Date;
}
export const CourseSchema = SchemaFactory.createForClass(Course);
