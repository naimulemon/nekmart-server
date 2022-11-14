import { Resolver, Mutation, Query, Args, Context, ID } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { ObjectId } from "mongoose";

//Service
import { WithdrawService } from "./withdraw.service";

//Dto
import { ReleasePaymentInput } from "./dto/payment.dto";

//Entities
import { SuccessInfo } from "src/user/entities/success.entity";
import { IncomePayment } from "./entities/payamount.entities";
import { Withdraw } from "./entities/withdraw.entities";

//Guard
import { Roles } from "src/auth/decorator/auth.decorator";
import { Role } from "src/auth/enum/auth.enum";
import { AuthGuard } from "src/auth/auth.guard";
import { RolesGuard } from "src/auth/roles.guard";

//Types
import { ReqUser } from "src/auth/types/user.types";


@Resolver()
export class WithdrawResolver {
    //Constructor
    constructor(
        private readonly withdrawService: WithdrawService
    ) { }

    //Get withdrawal
    @Query(() => [Withdraw], { name: "getWithdrawal" })
    @Roles(Role.SELLER, Role.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    get(
        @Args("sellerId", { type: () => ID }) sellerId: ObjectId,
        @Context("user") reqUser: ReqUser
    ) {
        return this.withdrawService.get(sellerId, reqUser);
    }

    //Get payment by delivered after 7 days
    @Query(() => IncomePayment, { name: "getAfterIncome" })
    @Roles(Role.ADMIN, Role.SELLER)
    @UseGuards(AuthGuard, RolesGuard)
    getAfter(
        @Args("sellerId", { type: () => ID }) sellerId: ObjectId
    ) {
        return this.withdrawService.getAfter(sellerId);
    }

    //Get total payment into 7 days
    @Query(() => IncomePayment, { name: "getCurrentIncome" })
    @Roles(Role.ADMIN, Role.SELLER)
    @UseGuards(AuthGuard, RolesGuard)
    getCurrent(
        @Args("sellerId", { type: () => ID }) sellerId: ObjectId
    ) {
        return this.withdrawService.getCurrent(sellerId);
    }

    //Get processing payment from seller
    @Query(() => [Withdraw], { name: "getProcessingWithdraw" })
    @Roles(Role.SELLER)
    @UseGuards(AuthGuard, RolesGuard)
    getProcessing(
        @Context("user") reqUser: ReqUser
    ) {
        return this.withdrawService.process(reqUser);
    }

    //Release payment
    @Mutation(() => SuccessInfo, { name: "releasePayment" })
    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    release(
        @Args("paymentInput") paymentInput: ReleasePaymentInput,
        @Context("user") reqUser: ReqUser
    ) {
        return this.withdrawService.release(paymentInput, reqUser);
    }

    //Confirm payment by seller
    @Mutation(() => SuccessInfo, { name: "confirmPayment" })
    @Roles(Role.SELLER)
    @UseGuards(AuthGuard, RolesGuard)
    confirm(
        @Args("withdrawId", { type: () => ID }) withdrawId: ObjectId
    ) {
        return this.withdrawService.confirm(withdrawId);
    }
}