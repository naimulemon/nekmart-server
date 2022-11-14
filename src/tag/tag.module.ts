import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

//Service and Resolver
import { TagService } from "./tag.service";
import { TagResolver } from "./tag.resolver";

//Schema
import { Tag, TagSchema } from "./model/tag.schema";

//Modules
import { UserModule } from "src/user/user.module";


@Module({
    imports: [
        MongooseModule.forFeature([{
            name: Tag.name,
            schema: TagSchema
        }]),
        UserModule
    ],
    providers: [TagService, TagResolver],
    exports: [MongooseModule, TagService]
})

export class TagModule { };