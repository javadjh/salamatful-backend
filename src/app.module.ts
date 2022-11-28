import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryModule } from './category/category.module';
import { CourseModule } from './course/course.module';
import { BlogModule } from './blog/blog.module';
import { StoryModule } from './story/story.module';
import { PaymentModule } from './payment/payment.module';
import { VideoModule } from './video/video.module';
import { AudioModule } from './audio/audio.module';
import { TokenModule } from './token/token.module';
import { LoggerMiddleware } from './middlewares/loggermiddleware';
import { GalleryModule } from './gallery/gallery.module';
import { StaticsModule } from './statics/statics.module';
import { DailyphotoModule } from './dailyphoto/dailyphoto.module';
import { TicketModule } from './ticket/ticket.module';
import { PriceModule } from './price/price.module';
import { DiscountModule } from './discount/discount.module';
import { MessageModule } from './message/message.module';
import { CodeModule } from './code/code.module';
import { BackgroundsModule } from './backgrounds/backgrounds.module';
import { ReplyModule } from './reply/reply.module';
import { ProgressModule } from './progress/progress.module';
import { AccessModule } from './access/access.module';
import { PurchaseModule } from './purchase/purchase.module';
import { DynamicsModule } from './dynamics/dynamics.module';
import { WalletModule } from './wallet/wallet.module';
import { SocialModule } from './social/social.module';
import { LikeModule } from './like/like.module';
import { RateModule } from './rate/rate.module';
import { WebblogModule } from './webblog/webblog.module';

@Module({
  imports: [
    UserModule,
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/salamatful'),
    CategoryModule,
    CourseModule,
    BlogModule,
    StoryModule,
    PaymentModule,
    VideoModule,
    AudioModule,
    TokenModule,
    GalleryModule,
    StaticsModule,
    DailyphotoModule,
    TicketModule,
    PriceModule,
    DiscountModule,
    MessageModule,
    CodeModule,
    BackgroundsModule,
    ReplyModule,
    ProgressModule,
    AccessModule,
    PurchaseModule,
    DynamicsModule,
    WalletModule,
    SocialModule,
    LikeModule,
    RateModule,
    WebblogModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
