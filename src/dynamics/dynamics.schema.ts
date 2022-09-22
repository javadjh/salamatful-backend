import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type DynamicsDocument = Dynamics & Document;
@Schema()
export class Dynamics {
    @Prop({ default: [] })
    videoCategories: Array<string>
}
export const DynamicsSchema = SchemaFactory.createForClass(Dynamics);