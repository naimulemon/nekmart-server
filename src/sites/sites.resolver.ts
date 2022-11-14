import { Resolver, Mutation, Query, Args } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";

//Service
import { SiteService } from "./sites.service";

//Entities
import { SuccessInfo } from "src/user/entities/success.entity";
import { Site } from "./entities/site.entities";

//Dto
import { SiteInput } from "./dto/site.dto";

//Guard
import { Roles } from "src/auth/decorator/auth.decorator";
import { Role } from "src/auth/enum/auth.enum";
import { AuthGuard } from "src/auth/auth.guard";
import { RolesGuard } from "src/auth/roles.guard";

@Resolver()
export class SiteResolver {
    //Constructor
    constructor(
        private readonly siteService: SiteService
    ) { };

    //Get Site settings
    @Query(() => Site, { name: "getSiteSettings" })
    get() {
        return this.siteService.get();
    }

    //Save or Add Site setting
    @Mutation(() => SuccessInfo, { name: "siteSettings" })
    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    site(
        @Args("siteInput") siteInput: SiteInput
    ) {
        return this.siteService.site(siteInput);
    }
}