import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

//Service and Resolver
import { SiteService } from "./sites.service";
import { SiteResolver } from "./sites.resolver";

//Schema
import { Site, SiteSchema } from "./model/sites.schema";

//Module
import { UserModule } from "src/user/user.module";

@Module({
    imports: [
        MongooseModule.forFeature([{
            name: Site.name,
            schema: SiteSchema
        }]),
        UserModule
    ],
    providers: [SiteService, SiteResolver]
})

export class SiteModule { };