import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

//Service and Resolver 
import { ShippingService } from "./shipping.service";
import { ShippingResolver } from "./shipping.resolver";

//Schema
import { Shipping, ShippingSchema } from "./model/shipping.schema";

//Module
import { UserModule } from "src/user/user.module";

@Module({
    imports: [
        MongooseModule.forFeature([{
            name: Shipping.name,
            schema: ShippingSchema
        }]),
        UserModule
    ],
    providers: [ShippingService, ShippingResolver],
    exports: [MongooseModule, ShippingService]
})

export class ShippingModule { };