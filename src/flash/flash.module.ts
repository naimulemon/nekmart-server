import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

//Service and Resolver
import { FlashService } from "./flash.service";
import { FlashResolver } from "./flash.resolver";

//Schema
import { Flash, FlashSchema } from "./model/flash.schema";

//Module
import { UserModule } from "src/user/user.module";

@Module({
    imports: [
        MongooseModule.forFeature([{
            name: Flash.name,
            schema: FlashSchema
        }]),
        UserModule
    ],
    providers: [FlashService, FlashResolver],
    exports: [MongooseModule, FlashService]
})

export class FlashModule { }