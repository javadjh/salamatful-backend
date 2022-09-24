import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { VideoSchema } from 'src/video/video.schema';
import { WalletSchema } from './wallet.schema';
import { User, UserSchema } from 'src/user/user.schema';

@Module({
  controllers: [WalletController],
  providers: [WalletService],
  imports: [MongooseModule.forFeature([
    { name: "User", schema: UserSchema },
    {name:"Wallet", schema:WalletSchema},
  ])],  
})
export class WalletModule {}
