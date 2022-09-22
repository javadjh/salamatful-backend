import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TokensDocument = Token & Document;

@Schema()
export class Token {
    @Prop({ required: true, trim: true })
    userId: String;
    @Prop({ trim: true })
    phone: String;
    @Prop({ required: true, trim: true })
    token: String;
}

export const tokenSchema = SchemaFactory.createForClass(Token)