import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

//Service and Resolvers 
import { ProductService } from "./product.service";
import { ProductResolver } from "./product.resolver";

//Schema
import { Product, ProductSchema } from "./model/product.schema";

//Module
import { UserModule } from "src/user/user.module";
import { SellerModule } from "src/seller/seller.module";
import { FlashModule } from "src/flash/flash.module";
import { CategoryModule } from "src/category/category.module";
import { BrandModule } from "src/brand/brand.module";

@Module({
    imports: [
        MongooseModule.forFeature([{
            name: Product.name,
            schema: ProductSchema
        }]),
        UserModule,
        SellerModule,
        FlashModule,
        CategoryModule,
        BrandModule
    ],
    providers: [ProductService, ProductResolver],
    exports: [MongooseModule, ProductService]
})

export class ProductModule { };