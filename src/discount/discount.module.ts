import { Module } from '@nestjs/common';
import { DiscountService } from './discount.service';
import { DiscountController } from './discount.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DiscountSchema } from './discount.schema';
import { PriceSchema } from 'src/price/price.schema';

@Module({
  controllers: [DiscountController],
  providers: [DiscountService],
  imports: [
    MongooseModule.forFeature([
      { name: 'Discount', schema: DiscountSchema },
      { name: 'Price', schema: PriceSchema },
    ]),
  ],
})
export class DiscountModule {}
