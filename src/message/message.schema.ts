import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MessagesDocument = Messages & Document;
@Schema()
export class Messages {
  @Prop({ required: true })
  key: string;
  @Prop({ trim: true })
  text: string;
}
export const MessagesSchema = SchemaFactory.createForClass(Messages);
