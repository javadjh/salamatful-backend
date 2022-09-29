import { Module } from "@nestjs/common";
import { SocialService } from "./social.service";
import { SocialController } from "./social.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { SocialSchema } from "./social.schema";

@Module({
  imports: [MongooseModule.forFeature([
    { name: "Social", schema: SocialSchema }
  ])],
  controllers: [SocialController],
  providers: [SocialService]
})
export class SocialModule {
}
