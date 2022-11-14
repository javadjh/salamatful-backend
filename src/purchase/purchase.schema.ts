import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PurchaseDocument = Purchase & Document;
@Schema()
export class Purchase {
    @Prop()
    userId: string;
    @Prop()
    courseId: string;
    @Prop({ type: Date })
    at: Date;
    @Prop({ type: Date })
    to: Date
}
export const PurchaseSchema = SchemaFactory.createForClass(Purchase);
