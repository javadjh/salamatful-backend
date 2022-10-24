import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
export type BackgroundDocument = Background & Document;

@Schema()
export class Background {
  @Prop({ default: [] })
  types: Array<string>;
  @Prop({ default: [] })
  times: Array<string>;
  @Prop({ trim: true })
  url: string;
  @Prop({ type: Object })
  file: {
    name: string;
    path: string;
    mime: string;
  };
  @Prop()
  wide: boolean;
}
export const BackgroundSchema = SchemaFactory.createForClass(Background);
