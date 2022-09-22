import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
export type TicketDocument = Ticket & Document;

@Schema()
export class Ticket {
  @Prop({ trim: true })
  title: string;
  @Prop({ default: false })
  closed: boolean;
  @Prop({ required: true, trim: true })
  userId: string;
  @Prop({ type: Date })
  at: Date;
}
export const TicketSchema = SchemaFactory.createForClass(Ticket);
