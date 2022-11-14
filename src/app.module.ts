import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { MongooseModule } from "@nestjs/mongoose";
import { ScheduleModule } from "@nestjs/schedule";
import slug from "mongoose-slug-updater";

//Path
import { join } from "path";

//Using Apollo Studio
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';

//Module
import { UserModule } from "./user/user.module";
import { CategoryModule } from "./category/category.module";
import { BrandModule } from "./brand/brand.module";
import { TagModule } from "./tag/tag.module";
import { AttributeModule } from "./attributes/attributes.module";
import { AddressModule } from "./address/address.module";
import { ProductModule } from "./product/product.module";
import { CartModule } from "./cart/cart.module";
import { ShippingModule } from "./shipping/shipping.module";
import { PlatformModule } from "./platform/platform.module";
import { OrderModule } from "./orders/orders.module";
import { SiteModule } from './sites/sites.module';
import { ReviewModule } from "./reviews/review.module";
import { WishlistModule } from "./wishlist/wishlist.module";
import { CouponModule } from "./coupon/coupon.module";
import { PointModule } from "./points/points.module";
import { RefundModule } from "./refund/refund.module";
import { FlashModule } from "./flash/flash.module";
import { PreorderModule } from "./preorder/preorder.module";
import { HomeModule } from "./homepgae/home.module";
import { SellerModule } from "./seller/seller.module";
import { WithdrawModule } from "./withdraw/withdraw.module";
import { AnalyticsModule } from "./analytics/analytics.module";

//Dataloader
import { DataloaderService } from "./dataloader/dataloader.service";
import { DataloaderModule } from "./dataloader/dataloader.module";

@Module({
  imports: [
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [DataloaderModule],
      inject: [DataloaderService],
      useFactory: (dataloaderService: DataloaderService) => ({
        autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        installSubscriptionHandlers: true,
        playground: false,
        persistedQueries: false,
        path: "nekmart",
        uploads: false,
        plugins: [ApolloServerPluginLandingPageLocalDefault()],
        context: ({ req }) => ({
          headers: req.headers,
          loaders: dataloaderService.createLoaders()
        })
      })
    }),
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URL, {
      connectionFactory: (connection) => {
        connection.plugin(slug, { number: true });
        return connection
      }
    }),
    ScheduleModule.forRoot(),
    UserModule,
    CategoryModule,
    BrandModule,
    TagModule,
    AttributeModule,
    AddressModule,
    ProductModule,
    CartModule,
    ShippingModule,
    PlatformModule,
    OrderModule,
    SiteModule,
    ReviewModule,
    WishlistModule,
    CouponModule,
    PointModule,
    RefundModule,
    FlashModule,
    PreorderModule,
    HomeModule,
    SellerModule,
    WithdrawModule,
    AnalyticsModule
  ]
})
export class AppModule { }