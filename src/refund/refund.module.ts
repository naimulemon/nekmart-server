import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

//Service and Resolver 
import { RefundService } from "./refund.service";
import { RefundResolver, RefundProductsResolver } from "./refund.resolver";

//Schema
import { Refund, RefundSchema } from "./model/refund.schema";

//Module
import { UserModule } from "src/user/user.module";
import { OrderModule } from "src/orders/orders.module";
import { SellerModule } from "src/seller/seller.module";

@Module({
    imports: [
        MongooseModule.forFeature([{
            name: Refund.name,
            schema: RefundSchema
        }]),
        UserModule,
        OrderModule,
        SellerModule
    ],
    providers: [RefundService, RefundResolver, RefundProductsResolver]
})

export class RefundModule { };