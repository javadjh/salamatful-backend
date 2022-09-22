import { Module } from '@nestjs/common';
import { BackgroundsService } from './backgrounds.service';
import { BackgroundsController } from './backgrounds.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BackgroundSchema } from './backgrounds.schema';

@Module({
  controllers: [BackgroundsController],
  providers: [BackgroundsService],
  imports: [MongooseModule.forFeature([
    { name: "Background", schema: BackgroundSchema },
  ])],
})
export class BackgroundsModule { }
