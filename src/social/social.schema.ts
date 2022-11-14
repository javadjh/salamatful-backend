import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type SocialDocument = Social & Document;

@Schema()
export class Social {
  @Prop()
  type: string;
  @Prop()
  url: string;
}

export const SocialSchema = SchemaFactory.createForClass(Social);