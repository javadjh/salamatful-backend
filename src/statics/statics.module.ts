import { Module } from '@nestjs/common';
import { StaticsService } from './statics.service';
import { StaticsController } from './statics.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { StaticsSchema } from './statics.schema';

@Module({
  controllers: [StaticsController],
  providers: [StaticsService],
  imports: [MongooseModule.forFeature([
    { name: 'Statics', schema: StaticsSchema },
  ])],
})
export class StaticsModule { }
