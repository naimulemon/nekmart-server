import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

//Service and Resolver
import { BrandService } from "./brand.service";
import { BrandResolver } from "./brand.resolver";

//Schema
import { Brand, BrandSchema } from "./model/brand.schema";

//Module
import { UserModule } from "src/user/user.module";

@Module({
    imports: [
        MongooseModule.forFeature([{
            name: Brand.name,
            schema: BrandSchema
        }]),
        UserModule
    ],
    providers: [BrandService, BrandResolver],
    exports: [MongooseModule, BrandService]
})

export class BrandModule { }