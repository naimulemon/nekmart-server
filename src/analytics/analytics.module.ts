import { Module } from "@nestjs/common";

//Service and Resolver
import { AnalyticsService } from "./analytics.service";
import { AnalyticsResolver } from "./analytics.resolver";

//Modules
import { ProductModule } from "src/product/product.module";
import { OrderModule } from "src/orders/orders.module";
import { UserModule } from "src/user/user.module";
import { AddressModule } from "src/address/address.module";
import { WishlistModule } from "src/wishlist/wishlist.module";
import { CartModule } from "src/cart/cart.module";
import { SellerModule } from "src/seller/seller.module";
import { WithdrawModule } from "src/withdraw/withdraw.module";
import { FlashModule } from "src/flash/flash.module";

@Module({
    imports: [
        ProductModule,
        OrderModule,
        UserModule,
        WishlistModule,
        AddressModule,
        CartModule,
        SellerModule,
        WithdrawModule,
        FlashModule
    ],
    providers: [AnalyticsService, AnalyticsResolver]
})
export class AnalyticsModule { }