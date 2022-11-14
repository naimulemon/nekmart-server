import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

//Service And Resolver
import { CartService } from "./cart.service";
import { CartResolver } from "./cart.resolver";

//Schema
import { Cart, CartSchema } from "./model/cart.schema";

//Modules
import { UserModule } from "src/user/user.module";
import { ProductModule } from "src/product/product.module";

@Module({
    imports: [
        MongooseModule.forFeature([{
            name: Cart.name,
            schema: CartSchema
        }]),
        UserModule,
        ProductModule
    ],
    providers: [CartService, CartResolver],
    exports: [MongooseModule]
})

export class CartModule { };