import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

//Service and Resolver
import { OrderService } from "./orders.service";
import { OrderResolver, OrderProductsResolver, SubProductsResolver, OrderBySellerResolver } from "./orders.resolver";

//Schema
import { Orders, OrderSchema } from "./model/orders.schema";

//User
import { UserModule } from "src/user/user.module";
import { SellerModule } from "src/seller/seller.module";
import { CartModule } from "src/cart/cart.module";
import { PointModule } from "src/points/points.module";
import { ProductModule } from "src/product/product.module";

@Module({
    imports: [
        MongooseModule.forFeature([{
            name: Orders.name,
            schema: OrderSchema
        }]),
        UserModule,
        SellerModule,
        CartModule,
        PointModule,
        ProductModule
    ],
    providers: [OrderService, OrderResolver, OrderProductsResolver, SubProductsResolver, OrderBySellerResolver],
    exports: [MongooseModule, OrderService]
})
export class OrderModule { };