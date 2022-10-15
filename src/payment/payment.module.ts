import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/user/user.schema';
import { PriceSchema } from 'src/price/price.schema';
import { DiscountSchema } from 'src/discount/discount.schema';
import { MessagesSchema } from 'src/message/message.schema';
import { CourseSchema } from 'src/course/course.schema';
import { PurchaseSchema } from 'src/purchase/purchase.schema';
import { WalletSchema } from "../wallet/wallet.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Price', schema: PriceSchema },
      { name: 'Discount', schema: DiscountSchema },
      { name: 'Message', schema: MessagesSchema },
      { name: 'Course', schema: CourseSchema },
      { name: 'Purchase', schema: PurchaseSchema },
      { name: 'Wallet', schema: WalletSchema },
    ]),
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
