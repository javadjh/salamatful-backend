import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type LikeDocument = Like & Document;
@Schema()
export class Like {
  @Prop()
  uId: string;
  @Prop()
  objId: string;
  @Prop()
  cat: string;
}
export const LikeSchema = SchemaFactory.createForClass(Like);