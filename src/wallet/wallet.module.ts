import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
<<<<<<< HEAD
import { MongooseModule } from '@nestjs/mongoose';
import { VideoSchema } from 'src/video/video.schema';
import { WalletSchema } from './wallet.schema';
import { User, UserSchema } from 'src/user/user.schema';
=======
import { MongooseModule } from "@nestjs/mongoose";
import { UserSchema } from "../user/user.schema";
import { WalletSchema } from "./wallet.schema";
>>>>>>> 44626180417b4c7ebbcc09024950df767b7b9d58

@Module({
  controllers: [WalletController],
  providers: [WalletService],
  imports: [MongooseModule.forFeature([
<<<<<<< HEAD
    { name: "User", schema: UserSchema },
    {name:"Wallet", schema:WalletSchema},
  ])],  
=======
    { name: 'User', schema: UserSchema },
    { name: 'Wallet', schema: WalletSchema },
  ])],
>>>>>>> 44626180417b4c7ebbcc09024950df767b7b9d58
})
export class WalletModule {}
