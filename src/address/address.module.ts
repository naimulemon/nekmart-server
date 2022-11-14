import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

//Service and Resolver
import { AddressService } from "./address.service";
import { AddressResolver } from "./address.resolver";

//Schema
import { Address, AddressSchema } from "./model/address.schema";

//Module
import { UserModule } from "src/user/user.module";

@Module({
    imports: [
        MongooseModule.forFeature([{
            name: Address.name,
            schema: AddressSchema
        }]),
        UserModule
    ],
    providers: [AddressService, AddressResolver],
    exports: [MongooseModule, AddressService]
})
export class AddressModule { };