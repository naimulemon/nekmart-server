import { Resolver, Query, Context } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";

//Service
import { AnalyticsService } from "./analytics.service";

//Entity
import { AdminAnalytics } from "./entities/analytics-admin.entity";
import { SellerAnalytics } from "./entities/analytics-seller.entity";
import { UserAnalytics } from "./entities/analytics-user.entity";

//Guard
import { Roles } from "src/auth/decorator/auth.decorator";
import { Role } from "src/auth/enum/auth.enum";
import { AuthGuard } from "src/auth/auth.guard";
import { RolesGuard } from "src/auth/roles.guard";

//Types
import { ReqUser } from "src/auth/types/user.types";

@Resolver()
export class AnalyticsResolver {
    //Constructor
    constructor(
        private readonly analyticsService: AnalyticsService
    ) { }

    //Get Analytics for admin dashboard
    @Query(() => AdminAnalytics, { name: "getAnalyticsByAdmin" })
    @Roles(Role.EDITOR, Role.MODERATOR, Role.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    admin() {
        return this.analyticsService.admin();
    }

    //Get Analytics for seller dashboard
    @Query(() => SellerAnalytics, { name: "getAnalyticsBySeller" })
    @Roles(Role.USER, Role.SELLER)
    @UseGuards(AuthGuard, RolesGuard)
    seller(
        @Context("user") reqUser: ReqUser
    ) {
        return this.analyticsService.seller(reqUser);
    }

    //Get Analytics for user dashboard
    @Query(() => UserAnalytics, { name: "getDashboardByUser" })
    @UseGuards(AuthGuard)
    user(
        @Context("user") reqUser: ReqUser
    ) {
        return this.analyticsService.user(reqUser);
    }
}