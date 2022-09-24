import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PriceDocument } from 'src/price/price.schema';
import { UserDocument } from 'src/user/user.schema';
import { WalletDocument } from './wallet.schema';

@Injectable()
export class WalletService {
    constructor(
        @InjectModel('Wallet') private walletModel: Model<WalletDocument>,
        @InjectModel('User') private userModel: Model<UserDocument>,
    ) { }

    async getInfo(userId: string): Promise<{ plan: string; expiry: Date; cash: number; name: string; } | { code: number; message: string; }> {
        const user = await this.userModel.findById(userId, 'name');
        if (user) {
            const wallet = await this.walletModel.findOne({ userId });
            return {
                name: user.name,
                cash: wallet.cash,
                expiry: wallet.expiry,
                plan: wallet.planType,
            }
        }
        return {
            code: -1,
            message: 'User Id is not defined',
        }
    }

    async getPlan(userId: string): Promise<{ plan: string; } | { code: number; message: string; }> {
        const user = await this.userModel.findById(userId, 'name');
        if (user) {
            const wallet = await this.walletModel.findOne({ userId }, "plan");
            return {
                plan: wallet.planType,
            }
        }
        return {
            code: -1,
            message: 'User Id is not defined',
        }
    }
    async redeem(userId: string): Promise<{ status: string; }> {
        const user = await this.userModel.findById(userId, 'name');
        if (user) {
            const wallet = await this.walletModel.findOne({ userId: userId })
            if (wallet.expiry < new Date()) {
                return { status: "Ok" }
            }
        }
        return {status:"not ok"}
    }    

}
