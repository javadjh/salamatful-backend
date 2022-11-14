import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UserDocument } from "src/user/user.schema";
import { WalletDocument } from "./wallet.schema";

@Injectable()
export class WalletService {
  constructor(
    @InjectModel("Wallet") private walletModel: Model<WalletDocument>,
    @InjectModel("User") private userModel: Model<UserDocument>
  ) {
  }

  async createWallet(userId: string, body) {
    const user = await this.userModel.findById(userId, "id name");
    if (!user) return { code: -1, message: "User does not exist" };
    return await this.walletModel.create({ cardNumber: body.cardNumber, userId });
  }

  async updateCardNumber(userId: string, body) {
    const user = await this.userModel.findById(userId, "id name");
    if (!user) return { code: -1, message: "User does not exist" };
    await this.walletModel.updateOne({ userId }, { cardNumber: body.cardNumber });
    return { code: 1, message: 'Card number updated' }
  }

  async getInfo(userId: string): Promise<{ plan: string; cardNumber: string; expiry: Date; cash: number; name: string; } | { code: number; message: string; }> {
    const user = await this.userModel.findById(userId, "name");
    if (user) {
      const wallet = await this.walletModel.findOne({ userId });
      if (!wallet) return { code: -1, message: "Wallet does not exist" };
      return {
        name: user.name,
        cash: wallet?.cash,
        cardNumber: wallet?.cardNumber,
        expiry: wallet?.expiry,
        plan: wallet?.planType
      };
    }
    return {
      code: -1,
      message: "User Id is not defined"
    };
  }

  async getPlan(userId: string): Promise<{ plan: string; } | { code: number; message: string; }> {
    const user = await this.userModel.findById(userId, "name");
    if (user) {
      const wallet = await this.walletModel.findOne({ userId }, "plan");
      return {
        plan: wallet.planType
      };
    }
<<<<<<< HEAD
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
=======
    return {
      code: -1,
      message: "User Id is not defined"
    };
  }

  async redeem(userId: string): Promise<{ status: string; }> {
    const user = await this.userModel.findById(userId, "name");
    return { status: "not ok" };
  }
>>>>>>> 44626180417b4c7ebbcc09024950df767b7b9d58

}
