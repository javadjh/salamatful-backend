import { Module } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { ProgressController } from './progress.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProgressSchema } from './progress.schema';

@Module({
  controllers: [ProgressController],
  providers: [ProgressService],
  imports: [MongooseModule.forFeature([
    { name: 'Progress', schema: ProgressSchema },
  ])],
  exports: [MongooseModule.forFeature([
    { name: 'Progress', schema: ProgressSchema },
  ])],
})
export class ProgressModule {}
