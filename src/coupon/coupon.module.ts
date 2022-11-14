import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

//Service and Resolver
import { CouponService } from "./coupon.service";
import { CouponResolver } from "./coupon.resolver";

//Schema
import { Coupon, CouponSchema } from "./model/coupon.schema";

//Modules
import { UserModule } from "src/user/user.module";

@Module({
    imports: [
        MongooseModule.forFeature([{
            name: Coupon.name,
            schema: CouponSchema
        }]),
        UserModule
    ],
    providers: [CouponService, CouponResolver]
})

export class CouponModule { };