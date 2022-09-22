import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type GalleryDocument = Gallery & Document;
@Schema()
export class Gallery {
    @Prop({ required: true })
    cId: string;
    @Prop({ trim: true })
    title: string;
    @Prop({ default: false })
    lock: boolean;
    @Prop({ type: [Object], default: [] })
    imgs: Array<{
        name: string;
        path: string;
        mime: string;
    }>
    @Prop({ default: new Date() })
    cDate: Date;
}
export const GallerySchema = SchemaFactory.createForClass(Gallery);