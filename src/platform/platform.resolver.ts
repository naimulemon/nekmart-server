import { Resolver, Mutation, Query, Args } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";

//Service
import { PlatformService } from "./platform.service";

//Dto
import { PlatformInput } from "./dto/platform.dto";

//Entities
import { SuccessInfo } from "src/user/entities/success.entity";
import { Platform } from "./entities/platform.entity";

//Guards
import { Roles } from "src/auth/decorator/auth.decorator";
import { Role } from "src/auth/enum/auth.enum";
import { AuthGuard } from "src/auth/auth.guard";
import { RolesGuard } from "src/auth/roles.guard";

@Resolver()
export class PlatformResolver {
    //Constructor
    constructor(
        private readonly platformService: PlatformService
    ) { }

    //Get platform
    @Query(() => Platform, { name: "getPlatform" })
    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    get() {
        return this.platformService.get();
    }

    //Add platform charge
    @Mutation(() => SuccessInfo, { name: "addPlatform" })
    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    add(
        @Args("platformInput") platformInput: PlatformInput
    ) {
        return this.platformService.add(platformInput);
    }
}