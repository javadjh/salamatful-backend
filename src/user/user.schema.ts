import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  // user profile
  @Prop({ type: Object })
  bg: {
    name: string;
    path: string;
    mime: string;
  };
  @Prop({ trim: true })
  bgURL: string;
  // Call back URL after payment
  @Prop({ trim: true })
  callbackURL: string;
  // full name
  @Prop({ trim: true })
  name: string;
  // hashed password
  @Prop()
  pass: string;
  // role
  @Prop({ default: 'user' })
  role: string;
  // phone number
  @Prop({ required: true, unique: true, trim: true })
  phone: string;
  // courses which have been liked
  @Prop({ type: [Object], default: [] })
  fav: Array<{
    cId: string;
    name: string;
    bg: string;
  }>;
  // subscription expiry date
  @Prop({ default: null })
  sub: Date;
  // user progress days and last date which opened the app
  @Prop({ type: Object, default: { days: 0, last: new Date() } })
  progress: {
    last: Date;
    days: Number;
  };
  //does user signedup successfully?
  @Prop({ type: Boolean, default: false })
  validated: Boolean;

  @Prop({ type: Boolean, default: false })

  // stores authority code for payment
  @Prop()
  authority: string;
  // store the amount for payment
  @Prop()
  amount: string;
  // sign up date
  @Prop()
  priceId: string;
  @Prop({ default: new Date() })
  cDate: Date;
  // last update
  @Prop()
  uDate: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
