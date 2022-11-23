import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { PaymentDocument } from "src/payment/payment.schema";
import { UserDocument } from "src/user/user.schema";
import { WalletDocument } from "./wallet.schema";

@Injectable()
export class WalletService {
  constructor(
    @InjectModel("Wallet") private walletModel: Model<WalletDocument>,
    @InjectModel("User") private userModel: Model<UserDocument>,
    @InjectModel("Payment") private paymentModel: Model<PaymentDocument>,
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

  async getInfo(userId: string): Promise<{ plan: string; cardNumber: string; available: number; expiry: Date; cash: number; name: string; } | { code: number; message: string; }> {
    const user = await this.userModel.findById(userId, "name");
    if (user) {
      const wallet = await this.walletModel.findOne({ userId });
      if (!wallet) return { code: -1, message: "Wallet does not exist" };
      const available = await this.paymentModel.find({ $and: [{ to: { $lt: new Date() } }, { userId: userId }, { valid: true }] })
      let total: number = 0
      for (let payment of available) {
        total += payment.amount
      }
      return {
        name: user.name,
        cash: wallet?.cash,
        cardNumber: wallet?.cardNumber,
        available: total,
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
    return {
      code: -1,
      message: "User Id is not defined"
    };
  }

  async redeem(userId: string, body) {
    const user = await this.userModel.findById(userId, "name");
    if (user && body.paymentId) {
      const dataExists = await this.paymentModel.findOne({ $and: [{ userId: userId }, { id: body.paymentId }, { valid: true }] })
      if (dataExists) {
        await this.paymentModel.updateOne({ userId, id: body.paymentId, valid: true }, { requested: true });
        return {
          code: 1,
          message: 'successful'
        }
      }
      return {
        code: -1,
        message: 'invalid Data'
      }
    }

    return { status: "not ok" };
  }

}
