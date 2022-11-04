import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import axios from "axios";
import { Response } from "express";
import { Model } from "mongoose";
import { DiscountDocument } from "src/discount/discount.schema";
import kavenegar from "src/lib/kavenegar";
import { MessagesDocument } from "src/message/message.schema";
import { PriceDocument } from "src/price/price.schema";
import { PurchaseDocument } from "src/purchase/purchase.schema";
import { UserDocument } from "src/user/user.schema";
import { WalletDocument } from "../wallet/wallet.schema";
import { PaymentDocument } from "./payment.schema";

export const zarinpalRequestURL = "https://api.zarinpal.com/pg/v4/payment/request.json";
export const zarinpalVerifyURL = "https://api.zarinpal.com/pg/v4/payment/verify.json";
export const callBackURL = "https://salamatful.ir";
export const merchantId = "822b28f0-78ea-42a9-a76c-6249ccc4da7e";

// export const merchantId = '822b28f0-asdd-dssd-a76c-6249ccc4da7e';

enum MessagingEnum {
  MAINTEXT = "MAINTEXT",
  EXTRADAYS = "EXTRADAYS",
  COUPON = "COUPON",
}

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel("User") private userModel: Model<UserDocument>,
    @InjectModel("Price") private priceModel: Model<PriceDocument>,
    @InjectModel("Discount") private discountModel: Model<DiscountDocument>,
    @InjectModel("Message") private messageModel: Model<MessagesDocument>,
    @InjectModel("Course") private courseModel: Model<MessagesDocument>,
    @InjectModel("Purchase") private purchaseModel: Model<PurchaseDocument>,
    @InjectModel("Wallet") private walletModel: Model<WalletDocument>,
    @InjectModel("Payment") private paymentModel: Model<PaymentDocument>
  ) {
  }

  async getAuthorityCode(body, userId): Promise<any> {
    try {
      const { priceId, code, url } = body;

      if (
        priceId &&
        (await this.userModel.findOne({ _id: userId, validated: true }))
      ) {
        let price = await this.priceModel.findById(
          priceId,
          "amount desc extraDays couponGift"
        );
        const discount = await this.discountModel.findOne({
          code: code,
          priceId: priceId
        });
        if (discount && discount.amount < 100) {
          price.amount = price.amount * ((100 - discount.amount) / 100);
        }
        let res = await axios.post(zarinpalRequestURL, {
          merchant_id: merchantId,
          amount: price.amount,
          description: price.desc,
          callback_url: "https://salamatful.ir/api/v1/payment/check"
        });
        res = res.data;
        if (res.data.code == 100) {
          await this.userModel.updateOne(
            { _id: userId },
            {
              authority: res.data.authority,
              amount: `${price.amount}`,
              callbackURL: url,
              priceId
            }
          );
        }
        return res;
      }
      return { code: -1, message: "Some parameters have been missed." };
    } catch (error) {
      return { error: error, code: -1 };
    }
  }

  async checkTransaction(query: { Authority: string; Status: string }, response: Response): Promise<any> {
    try {
      const { Authority, Status } = query;
      const dataExists = await this.userModel.findOne(
        { authority: Authority },
        "_id authority amount priceId phone callbackURL"
      );
      console.log(dataExists)
      if (dataExists) {
        const res = await axios.post(zarinpalRequestURL, {
          merchant_id: merchantId,
          amount: dataExists.amount,
          authority: dataExists.authority
        });
        if (Status === "OK") {
          const plan = await this.priceModel.findOne({
            _id: dataExists.priceId
          });

          let days = plan.days;
          let type = plan.type;
          if (plan.extraDays) {
            days += plan.extraDays;
          }
          console.log("type:\t" + type);
          const expiryDate = new Date();
          expiryDate.setDate(expiryDate.getDate() + days);
          console.log("expiry date:\t" + expiryDate);
          let wallet = await this.walletModel.findOne({ userId: dataExists._id });
          console.log("Wallet:");
          console.log(wallet);
          if (type === "Investment" && wallet) {
            wallet.cash += parseInt(dataExists.amount);
            wallet.planType = days.toString();
            wallet.expiry = expiryDate;
            console.log("New Wallet:");
            console.log(wallet);
            await this.walletModel.updateOne({ id: wallet.id }, {
              cash: wallet.cash,
              planType: wallet.planType,
              expiry: wallet.expiry
            });
          }
          console.log("Courses:");
          console.log(plan.courses);
          for (let courseId of plan.courses) {
            const course = await this.courseModel.findById(courseId);
            if (course) {
              const date = new Date();
              date.setDate(date.getDate() + days);
              await this.purchaseModel.create({ courseId, userId: dataExists._id, at: new Date(), to: date });
            }
          }
          await this.userModel.updateOne(
            { _id: dataExists._id, authority: Authority },
            { sub: expiryDate, authority: `${Authority}-expired` }
          );
          await this.paymentModel.create({
            amount: dataExists.amount,
            type: type,
            at: new Date(),
            userId: dataExists._id,
            plan: plan._id
          });
          // let coupon;
          // if (plan.couponGift)
          //   coupon = await this.discountModel.findById(plan.couponGift);
          // const messages = await this.messageModel.find();
          // let messageArr: string[] = [];
          // if (plan.extraDays != 0 || plan.couponGift) {
          //   messages.forEach((msg) => {
          //     if (msg.key == MessagingEnum.MAINTEXT) {
          //       messageArr.unshift(msg.text);
          //     }
          //     if (msg.key == MessagingEnum.EXTRADAYS) {
          //       messageArr.push(
          //         msg.text.replace("[AMOUNT]", plan.extraDays.toString())
          //       );
          //     }
          //     if (msg.key == MessagingEnum.COUPON && plan.couponGift) {
          //       messageArr.push(msg.text.replace("[AMOUNT]", coupon.code));
          //     }
          //   });
          //   if (messageArr.length) {
          //     kavenegar.sendSucceedPurchaseMessage({
          //       phone: dataExists.phone,
          //       message: messageArr.join("\n")
          //     });
          //   }
          // }
        }
      }
      return response.redirect("https://salamatful.ir/wallet-page");
    } catch (error) {
      console.error(error);
      return {
        code: -1,
        message: "Error occurred while checking payment status."
      };
    }
  }
}
