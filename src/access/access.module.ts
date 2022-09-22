import { Module } from '@nestjs/common';
import { AccessService } from './access.service';
import { AccessController } from './access.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AccessSchema } from './access.schema';

@Module({
  controllers: [AccessController],
  providers: [AccessService],
  imports: [MongooseModule.forFeature([
    { name: "Access", schema: AccessSchema }
  ])],
})
export class AccessModule {}
