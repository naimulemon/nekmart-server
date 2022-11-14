import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

//Service and Resolver 
import { PointService } from "./points.service";
import { PointResolver } from "./points.resolver";

//Schema
import { Points, PointsSchema } from "./model/points.schema";

//Modules
import { UserModule } from "src/user/user.module";

@Module({
    imports: [
        MongooseModule.forFeature([{
            name: Points.name,
            schema: PointsSchema
        }]),
        UserModule
    ],
    providers: [PointService, PointResolver],
    exports: [MongooseModule]
})

export class PointModule { };