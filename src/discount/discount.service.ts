import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PriceDocument } from 'src/price/price.schema';
import { DiscountDocument } from './discount.schema';
@Injectable()
export class DiscountService {
  constructor(
    @InjectModel('Discount') private discountModel: Model<DiscountDocument>,
    @InjectModel('Price') private priceModel: Model<PriceDocument>,
  ) {}

  async getDiscount(discountCode: string, priceId: string) {
    try {
      const discount = await this.discountModel.findOne({
        code: discountCode,
        priceId,
      });
      const price = await this.priceModel.findById(discount.priceId);
      if (!discount || !price)
        return { status: 'fail', message: 'invalid code' };

      const finalPrice = price.amount - (price.amount / 100) * discount.amount;
      return {
        status: 'success',
        amount: finalPrice,
      };
    } catch (err) {
      return { status: 'fail', message: err.message };
    }
  }
}
