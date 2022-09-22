import { Module } from '@nestjs/common';
import { AudioService } from './audio.service';
import { AudioController } from './audio.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AudioSchema } from './audio.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: "Audio", schema: AudioSchema }
  ])],
  controllers: [AudioController],
  providers: [AudioService]
})
export class AudioModule { }
