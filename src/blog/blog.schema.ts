import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Blog {
  @Prop({ required: true, trim: true })
  title: string;
  @Prop()
  slug: string;
  @Prop()
  courseId: string;
  @Prop({ trim: true })
  author: string;
  @Prop()
  desc: string;
  @Prop()
  meta: string;
  @Prop()
  pDate: Date;
  // category
  @Prop({ trim: true })
  cats: string;
  @Prop({ type: Object })
  img: {
    name: string;
    path: string;
    mime: string;
  };
  @Prop({ default: false })
  lock: boolean;
  @Prop()
  cDate: Date;
  @Prop()
  avgRate: number;
  @Prop()
  sumRates: number;
  @Prop()
  countRates: number;
}

export type BlogDocument = Blog & Document;
export const BlogSchema = SchemaFactory.createForClass(Blog);
