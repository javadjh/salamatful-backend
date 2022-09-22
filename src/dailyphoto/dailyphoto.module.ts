import { Module } from '@nestjs/common';
import { DailyphotoService } from './dailyphoto.service';
import { DailyphotoController } from './dailyphoto.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DailyPhotoSchema } from './dailyphoto.schema';
import { UserSchema } from 'src/user/user.schema';

@Module({
  controllers: [DailyphotoController],
  providers: [DailyphotoService],
  imports: [MongooseModule.forFeature([
    { name: "DailyPhoto", schema: DailyPhotoSchema },
    { name: "User", schema: UserSchema },
  ])],
  exports: [MongooseModule.forFeature([
    { name: "DailyPhoto", schema: DailyPhotoSchema },
    { name: "User", schema: UserSchema },
  ])],
})
export class DailyphotoModule { }
