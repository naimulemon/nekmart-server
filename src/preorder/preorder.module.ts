import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

//Service and Resolver
import { PreorderService } from "./preorder.service";
import { PreorderResolver } from "./preorder.resolver";

//Schema
import { Preorder, PreorderSchema } from "./model/preorder.schema";

//Module
import { UserModule } from "src/user/user.module";

@Module({
    imports: [
        MongooseModule.forFeature([{
            name: Preorder.name,
            schema: PreorderSchema
        }]),
        UserModule
    ],
    providers: [PreorderService, PreorderResolver]
})

export class PreorderModule { };