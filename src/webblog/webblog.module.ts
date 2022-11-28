import { Module } from "@nestjs/common";
import { WebblogService } from "./webblog.service";
import { WebblogController } from "./webblog.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { WebBlogSchema } from "./webblog.schema";

@Module({
  controllers: [WebblogController],
  providers: [WebblogService],
  imports: [MongooseModule.forFeature([
    { name: "Webblog", schema: WebBlogSchema }
  ])]
})
export class WebblogModule {
}
