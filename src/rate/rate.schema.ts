import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type RateDocument = Rate & Document;
@Schema()
export class Rate {
  @Prop()
 uId: string
 @Prop()
 objId: string
 @Prop()
 t: string  
 @Prop()
 r: number
}
export const RateSchema = SchemaFactory.createForClass(Rate);