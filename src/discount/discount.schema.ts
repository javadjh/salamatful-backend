import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type DiscountDocument = Discount & Document;
@Schema()
export class Discount {
    @Prop({ required: true })
    amount: number;
    @Prop({ required: true, trim: true })
    code: string;
    @Prop({ required: true })
    priceId: string;
}
export const DiscountSchema = SchemaFactory.createForClass(Discount);