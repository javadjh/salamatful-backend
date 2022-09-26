import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { MongooseModule } from "@nestjs/mongoose";
import { UserSchema } from "../user/user.schema";
import { WalletSchema } from "./wallet.schema";

@Module({
  controllers: [WalletController],
  providers: [WalletService],
  imports: [MongooseModule.forFeature([
    { name: 'User', schema: UserSchema },
    { name: 'Wallet', schema: WalletSchema },
  ])],
})
export class WalletModule {}
