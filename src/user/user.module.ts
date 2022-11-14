import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

//Service and Resolver
import { UserService } from "./user.service";
import { UserResolver } from "./user.resolver";

//Schema
import { User, UserSchema } from "./model/user.schema";

@Module({
    imports: [
        MongooseModule.forFeature([{
            name: User.name,
            schema: UserSchema
        }])
    ],
    providers: [UserService, UserResolver],
    exports: [MongooseModule, UserService]
})
export class UserModule { }