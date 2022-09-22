import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AccessDocument = Access & Document;

@Schema()
export class Access {
    @Prop()
    userId: string;
    @Prop()
    courseId: string;
    @Prop({ type: Date })
    till: Date;
}

export const AccessSchema = SchemaFactory.createForClass(Access);