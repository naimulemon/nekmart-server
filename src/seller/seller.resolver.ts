import { Resolver, ResolveField, Mutation, Query, Args, Context, ID, Parent } from "@nestjs/graphql";
import { ObjectId } from "mongoose";
import { UseGuards } from "@nestjs/common";

//Service
import { SellerService } from "./seller.service";

//Entities
import { SuccessInfo } from "src/user/entities/success.entity";
import { GetSeller, Seller } from "./entities/seller.entity";
import { User } from "src/user/entities/user.entity";
import { Income } from "./entities/income.entities";
import { RegisterInfo } from "src/user/entities/register.entity";

//Dto
import { SellerInput } from "./dto/seller.dto";
import { UpdateSellerInput } from "./dto/update.dto";
import { SellerPrams } from "./dto/get-seller.dto";
import { BankInformationInput } from "./dto/bank.dto";
import { LoginInput } from "src/user/dto/login.dto";

//Guard
import { Roles } from "src/auth/decorator/auth.decorator";
import { Role } from "src/auth/enum/auth.enum";
import { AuthGuard } from "src/auth/auth.guard";
import { RolesGuard } from "src/auth/roles.guard";

//Types
import { ReqUser } from "src/auth/types/user.types";


@Resolver(Seller)
export class SellerResolver {
    //Constructor
    constructor(
        private readonly sellerService: SellerService
    ) { }

    //Get sellers (by user)
    @Query(() => GetSeller, { name: "getSellers" })
    gets(
        @Args("sellerPrams") sellerPrams: SellerPrams
    ) {
        return this.sellerService.gets(sellerPrams)
    }

    //Get sellers (by admin)
    @Query(() => GetSeller, { name: "getSellersByAdmin" })
    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    getsByAdmin(
        @Args("sellerPrams") sellerPrams: SellerPrams
    ) {
        return this.sellerService.getsByAdmin(sellerPrams)
    }

    //Get Single seller by users
    @Query(() => Seller, { name: "getSellerByUser" })
    getByUser(
        @Args("slug", { type: () => String }) slug: string
    ) {
        return this.sellerService.getByUser(slug);
    }

    //Get seller by admin
    @Query(() => Seller, { name: "getSellerByAdmin" })
    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    getByAdmin(
        @Args("slug", { type: () => String }) slug: string
    ) {
        return this.sellerService.getByAdmin(slug);
    }

    //Get seller by Own
    @Query(() => Seller, { name: "getSellerByOwn" })
    @Roles(Role.USER, Role.SELLER)
    @UseGuards(AuthGuard, RolesGuard)
    getSellerOwn(
        @Context("user") reqUser: ReqUser
    ) {
        return this.sellerService.getSellerOwn(reqUser);
    }

    //Get income history by seller
    @Query(() => [Income], { name: "getIncomeHistory" })
    @Roles(Role.SELLER)
    @UseGuards(AuthGuard, RolesGuard)
    getIncome(
        @Context("user") reqUser: ReqUser
    ) {
        return this.sellerService.getIncome(reqUser);
    }

    //Get order history for refund
    @Query(() => [Income], { name: "getOrderForRefund" })
    @UseGuards(AuthGuard)
    getRefund(
        @Context("user") reqUser: ReqUser
    ) {
        return this.sellerService.getRefund(reqUser);
    }

    //Create seller
    @Mutation(() => SuccessInfo, { name: "createSeller" })
    @Roles(Role.USER)
    @UseGuards(AuthGuard, RolesGuard)
    create(
        @Args("sellerInput") sellerInput: SellerInput,
        @Context("user") reqUser: ReqUser
    ) {
        return this.sellerService.create(sellerInput, reqUser);
    }

    //Update seller
    @Mutation(() => SuccessInfo, { name: "updateSeller" })
    @Roles(Role.USER, Role.SELLER)
    @UseGuards(AuthGuard, RolesGuard)
    update(
        @Args("updateSellerInput") updateSellerInput: UpdateSellerInput,
        @Args("id", { type: () => ID }) id: ObjectId
    ) {
        return this.sellerService.update(id, updateSellerInput);
    }

    //Close seller account
    @Mutation(() => SuccessInfo, { name: "closeSeller" })
    @Roles(Role.USER, Role.SELLER)
    @UseGuards(AuthGuard, RolesGuard)
    close(
        @Context("user") reqUser: ReqUser
    ) {
        return this.sellerService.close(reqUser)
    }

    //Banned a seller
    @Mutation(() => SuccessInfo, { name: "bannedSeller" })
    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    banned(
        @Args("id", { type: () => ID }) id: ObjectId
    ) {
        return this.sellerService.banned(id);
    }

    //Unbanned seller
    @Mutation(() => SuccessInfo, { name: "unbannedSeller" })
    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    unbanned(
        @Args("id", { type: () => ID }) id: ObjectId
    ) {
        return this.sellerService.unbanned(id);
    }

    //Seller verification
    @Mutation(() => SuccessInfo, { name: "verifySeller" })
    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    verify(
        @Args("id", { type: () => ID }) id: ObjectId
    ) {
        return this.sellerService.verify(id)
    }

    //Add bank information
    @Mutation(() => SuccessInfo, { name: "addBankInformation" })
    @Roles(Role.SELLER)
    @UseGuards(AuthGuard, RolesGuard)
    bank(
        @Args("bankInformationInput") bankInformationInput: BankInformationInput,
        @Context("user") reqUser: ReqUser
    ) {
        return this.sellerService.bank(bankInformationInput, reqUser);
    }

    //Seller Login
    @Mutation(() => RegisterInfo, { name: "sellerLogin" })
    login(
        @Args("loginInput") loginInput: LoginInput
    ) {
        return this.sellerService.login(loginInput);
    }

    //ResolveField for user in seller query
    @ResolveField("user", () => User, { nullable: true })
    getUser(
        @Parent() seller: Seller,
        @Context() { loaders }: IGraphQLContext
    ) {
        return loaders.userLoader.load(seller.user);
    }
}

@Resolver(Income)
export class IncomeResolver {
    //ResolveField for user in seller query
    @ResolveField("user", () => User, { nullable: true })
    getUser(
        @Parent() income: Income,
        @Context() { loaders }: IGraphQLContext
    ) {
        return loaders.userLoader.load(income.user);
    }

    //ResolveField for seller in seller query
    @ResolveField("seller", () => Seller, { nullable: true })
    getSeller(
        @Parent() income: Income,
        @Context() { loaders }: IGraphQLContext
    ) {
        return loaders.sellerLoader.load(income.seller);
    }
}