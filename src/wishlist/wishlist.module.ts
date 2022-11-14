import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

//Service and Resolver
import { WishlistService } from "./wishlist.service";
import { WishlistResolver } from "./wishlist.resolver";

//Schema
import { Wishlist, WishlistSchema } from "./model/wishlist.schema";

//User
import { UserModule } from "src/user/user.module";

@Module({
    imports: [
        MongooseModule.forFeature([{
            name: Wishlist.name,
            schema: WishlistSchema
        }]),
        UserModule
    ],
    providers: [WishlistService, WishlistResolver],
    exports: [MongooseModule]
})

export class WishlistModule { };