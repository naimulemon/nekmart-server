import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

//Service and Resolver
import { ReviewService } from "./review.service";
import { ReviewResolver } from "./review.resolver";

//Schema
import { Review, ReviewSchema } from "./model/reviews.schema";

//Module
import { UserModule } from "src/user/user.module";
import { SellerModule } from "src/seller/seller.module";
import { OrderModule } from "src/orders/orders.module";
import { ProductModule } from "src/product/product.module";


@Module({
    imports: [
        MongooseModule.forFeature([{
            name: Review.name,
            schema: ReviewSchema
        }]),
        UserModule,
        OrderModule,
        ProductModule,
        SellerModule
    ],
    providers: [ReviewService, ReviewResolver]
})

export class ReviewModule { };