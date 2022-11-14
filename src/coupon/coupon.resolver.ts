import { Resolver, Mutation, Query, Args, Context, ID } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { ObjectId } from "mongoose";

//Service
import { CouponService } from "./coupon.service";

//Entities
import { SuccessInfo } from "src/user/entities/success.entity";
import { RedeemInfo } from "./entities/redeem.entity";
import { ApplyInfo } from "./entities/apply.entity";
import { CouponUser } from "./entities/coupon-user.entity";
import { CouponAdmin } from "./entities/coupon-admin.entity";

//Dto
import { CouponInput } from "./dto/coupon.dto";
import { CouponUpdateInput } from "./dto/update.dto";
import { RedeemInput } from "./dto/redeem.dto";
import { ApplyInput } from "./dto/apply.dto";

//Guard
import { Roles } from "src/auth/decorator/auth.decorator";
import { Role } from "src/auth/enum/auth.enum";
import { AuthGuard } from "src/auth/auth.guard";
import { RolesGuard } from "src/auth/roles.guard";

//Types
import { ReqUser } from "src/auth/types/user.types";

@Resolver()
export class CouponResolver {
    //Constructor
    constructor(
        private readonly couponService: CouponService
    ) { };

    //Get Coupon by User
    @Query(() => [CouponUser], { name: "getCouponByUser" })
    @UseGuards(AuthGuard)
    getByUser(
        @Context("user") reqUser: ReqUser
    ) {
        return this.couponService.getByUser(reqUser);
    };

    //Get Coupon by admin
    @Query(() => [CouponAdmin], { name: "getCouponByAdmin" })
    @Roles(Role.MODERATOR, Role.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    getByAdmin() {
        return this.couponService.getByAdmin();
    }

    //Get Single Coupon by admin
    @Query(() => CouponAdmin, { name: "getSingleCouponByAdmin" })
    @Roles(Role.MODERATOR, Role.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    getSingleByAdmin(
        @Args("slug", { type: () => String }) slug: string
    ) {
        return this.couponService.getSingleByAdmin(slug);
    }

    //Add Coupon
    @Mutation(() => SuccessInfo, { name: "addCoupon" })
    @Roles(Role.MODERATOR, Role.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    add(
        @Args("couponInput") couponInput: CouponInput
    ) {
        return this.couponService.add(couponInput);
    };

    //Redeem Coupon
    @Mutation(() => RedeemInfo, { name: "redeemCoupon" })
    @UseGuards(AuthGuard)
    redeem(
        @Args("redeemInput") redeemInput: RedeemInput,
        @Context("user") reqUser: ReqUser
    ) {
        return this.couponService.redeem(redeemInput, reqUser);
    }

    //Update Coupon
    @Mutation(() => SuccessInfo, { name: "updateCoupon" })
    @Roles(Role.MODERATOR, Role.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    update(
        @Args("couponUpdateInput") couponUpdateInput: CouponUpdateInput,
        @Args("id", { type: () => ID }) id: ObjectId
    ) {
        return this.couponService.update(couponUpdateInput, id);
    };

    //Apply Coupon
    @Mutation(() => ApplyInfo, { name: "applyCoupon" })
    @UseGuards(AuthGuard)
    apply(
        @Args("applyInput") applyInput: ApplyInput,
        @Context("user") reqUser: ReqUser
    ) {
        return this.couponService.apply(applyInput, reqUser);
    }

    //Delete Coupon
    @Mutation(() => SuccessInfo, { name: "deleteCoupon" })
    @Roles(Role.MODERATOR, Role.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    delete(
        @Args("id", { type: () => ID }) id: ObjectId
    ) {
        return this.couponService.delete(id);
    };
}