import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type WalletDocument = Wallet & Document;

@Schema()
export class Wallet {
    @Prop({ type: Date })
    expiry: Date;
    @Prop()
    cash: number;
    @Prop({ required: true })
    planType: string;
    @Prop({ type: String })
    userId: string;
    @Prop()
    cardNumber: string;

}

export const WalletSchema = SchemaFactory.createForClass(Wallet);
