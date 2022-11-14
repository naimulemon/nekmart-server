import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

//Schema
import { Withdraw, WithdrawSchema } from "./model/withdraw.schema";

//Service and Resolver
import { WithdrawService } from "./withdraw.service";
import { WithdrawResolver } from "./withdraw.resolver";

//Module
import { UserModule } from "src/user/user.module";
import { SellerModule } from "src/seller/seller.module";
import { PlatformModule } from "src/platform/platform.module";

@Module({
    imports: [
        MongooseModule.forFeature([{
            name: Withdraw.name,
            schema: WithdrawSchema
        }]),
        UserModule,
        SellerModule,
        PlatformModule
    ],
    providers: [WithdrawService, WithdrawResolver],
    exports: [MongooseModule]
})

export class WithdrawModule { }