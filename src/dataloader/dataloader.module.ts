import { Module } from "@nestjs/common";

//Dataloader Service
import { DataloaderService } from "./dataloader.service";

//Module
import { CategoryModule } from "src/category/category.module";
import { UserModule } from "src/user/user.module";
import { BrandModule } from "src/brand/brand.module";
import { TagModule } from "src/tag/tag.module";
import { ProductModule } from "src/product/product.module";
import { AddressModule } from "src/address/address.module";
import { ShippingModule } from "src/shipping/shipping.module";
import { OrderModule } from "src/orders/orders.module";
import { FlashModule } from "src/flash/flash.module";
import { SellerModule } from "src/seller/seller.module";

@Module({
    providers: [DataloaderService],
    imports: [CategoryModule, UserModule, BrandModule, TagModule, ProductModule, AddressModule, ShippingModule, OrderModule, FlashModule, SellerModule],
    exports: [DataloaderService]
})
export class DataloaderModule { };