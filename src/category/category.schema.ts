import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
export type CategoryDocument = Category & Document;

@Schema()
export class Category {
  @Prop({ required: true })
  name: string;
  @Prop()
  slug: string;
  @Prop({ type: Array })
  course: Array<any>;
  @Prop({ type: Array })
  carousel: [{ index: number; title: string; courses: Array<string>; showWide: boolean; mode: boolean; }];
  @Prop({ default: false })
  client: Boolean;
  @Prop({ type: Object })
  icon: {
    name: string;
    path: string;
    mime: string;
  };
  @Prop({ required: true, default: Date.now })
  cDate: Date;
}
export const CategorySchema = SchemaFactory.createForClass(Category);
