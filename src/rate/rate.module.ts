import { Module } from '@nestjs/common';
import { RateService } from './rate.service';
import { RateController } from './rate.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RateSchema } from './rate.schema';

@Module({
  controllers: [RateController],
  providers: [RateService],
  imports: [
    MongooseModule.forFeature([
      { name: 'Like', schema: RateSchema },
    ])],
})
export class RateModule {}
