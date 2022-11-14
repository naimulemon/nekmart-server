import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

//Service and Resolver
import { SellerService } from "./seller.service";
import { SellerResolver, IncomeResolver } from "./seller.resolver";

//Schema
import { Seller, SellerSchema } from "./model/seller.schema";
import { Income, IncomeSchema } from "./model/income.schema";

//Module
import { UserModule } from "src/user/user.module";
import { ProductModule } from "src/product/product.module";

@Module({
    imports: [
        MongooseModule.forFeature([{
            name: Seller.name,
            schema: SellerSchema
        }, {
            name: Income.name,
            schema: IncomeSchema
        }]),
        UserModule,
        forwardRef(() => ProductModule)
    ],
    providers: [SellerService, SellerResolver, IncomeResolver],
    exports: [SellerService, MongooseModule]
})

export class SellerModule { }