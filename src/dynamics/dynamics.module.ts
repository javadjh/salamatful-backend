import { Module } from '@nestjs/common';
import { DynamicsService } from './dynamics.service';
import { DynamicsController } from './dynamics.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {DynamicsSchema} from "./dynamics.schema";

@Module({
  controllers: [DynamicsController],
  providers: [DynamicsService],
  imports: [
    MongooseModule.forFeature([
      { name: 'Dynamics', schema: DynamicsSchema },
    ])]
})
export class DynamicsModule {}
