import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PriceDocument = Price & Document;
@Schema()
export class Price {
  @Prop({ required: true })
  amount: number;
  @Prop()
  realAmount: number;
  @Prop({ required: true })
  days: number;
  @Prop({ default: [] })
  courses: Array<string>;
  @Prop({ required: true })
  desc: string;
  @Prop()
  badge: string;
  @Prop()
  extraDays: number;
  @Prop()
  couponGift: string;
  @Prop({ type: Array, default: [] })
  bullets: Array<string>;
}
export const PriceSchema = SchemaFactory.createForClass(Price);
