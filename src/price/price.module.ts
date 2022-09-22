import { Module } from '@nestjs/common';
import { PriceService } from './price.service';
import { PriceController } from './price.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PriceSchema } from './price.schema';

@Module({
  controllers: [PriceController],
  providers: [PriceService],
  imports: [MongooseModule.forFeature([
    { name: 'Price', schema: PriceSchema },
  ])],
})
export class PriceModule { }
