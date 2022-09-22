import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TempUserDocument = TempUser & Document;

//This schema will holds smsCode and user's phoneNumber temporary, after
//that user signed up, it will be delete

@Schema()
export class TempUser {
  @Prop()
  smsCode: string;

  @Prop({ required: true, unique: true, trim: true })
  phone: string;

  @Prop({ default: false })
  confirmed: boolean;

  @Prop({ default: new Date() })
  generateDate: Date;
}

export const TempUserSchema = SchemaFactory.createForClass(TempUser);
