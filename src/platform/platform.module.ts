import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

//Service and Resolver
import { PlatformService } from "./platform.service";
import { PlatformResolver } from "./platform.resolver";

//Schema
import { Platform, PlatformSchema } from "./model/platform.schema";

//Module
import { UserModule } from "src/user/user.module";

@Module({
    imports: [
        MongooseModule.forFeature([{
            name: Platform.name,
            schema: PlatformSchema
        }]),
        UserModule
    ],
    providers: [PlatformService, PlatformResolver],
    exports: [MongooseModule]
})

export class PlatformModule { };