import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
export type CodeDocument = Code & Document;
@Schema()
export class Code {
  @Prop({ required: true })
  phone: string;
  @Prop({ required: true })
  code: number;
  @Prop({ required: true })
  validDate: Date;
}
export const CodeSchema = SchemaFactory.createForClass(Code);
