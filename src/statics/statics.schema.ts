import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type StaticsDocument = Statics & Document;
@Schema()
export class Statics {
    @Prop({ required: true })
    slug: string;
    @Prop({ trim: true })
    title: string;
    @Prop({ trim: true })
    text: string;
    @Prop({ default: true })
    client: boolean;
    @Prop({ default: true })
    delete: boolean;
    @Prop({ default: new Date() })
    createAt: Date;
}
export const StaticsSchema = SchemaFactory.createForClass(Statics);