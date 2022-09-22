import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
export type DailyPhotoDocument = DailyPhoto & Document;

@Schema()
export class DailyPhoto {
    @Prop({ trim: true })
    text: string;
    @Prop({ default: true })
    lock: boolean;
    @Prop({ type: Object })
    img: {
        name: string;
        path: string;
        mime: string;
    }
    @Prop({ type: Date, default: new Date() })
    updatedAt: Date;
}
export const DailyPhotoSchema = SchemaFactory.createForClass(DailyPhoto);