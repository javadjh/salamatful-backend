import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PaymentDocument = Payment & Document;
@Schema()
export class Payment {
  @Prop()
  amount: number;
  @Prop()
  type: string;
  @Prop()
  plan: string;
  @Prop({ type: Date })
  at: Date;
  @Prop()
  userId: string;
}
export const PaymentSchema = SchemaFactory.createForClass(Payment);