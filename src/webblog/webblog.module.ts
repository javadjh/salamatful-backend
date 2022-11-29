import { Module } from "@nestjs/common";
import { WebBlogService } from "./webblog.service";
import { WebblogController } from "./webblog.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { WebBlogSchema } from "./webblog.schema";

@Module({
  controllers: [WebblogController],
  providers: [WebBlogService],
  imports: [MongooseModule.forFeature([
    { name: "WebBlog", schema: WebBlogSchema }
  ])]
})
export class WebblogModule {
}
