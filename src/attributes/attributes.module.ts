import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

//Service and Resolver
import { AttributeService } from "./attributes.service";
import { AttributeResolver } from "./attributes.resolver";

//Schema
import { Attribute, AttributeSchema } from "./model/attributes.schema";

//Module
import { UserModule } from "src/user/user.module";

@Module({
    imports: [
        MongooseModule.forFeature([{
            name: Attribute.name,
            schema: AttributeSchema
        }]),
        UserModule
    ],
    providers: [AttributeService, AttributeResolver],
    exports: [MongooseModule]
})

export class AttributeModule { };