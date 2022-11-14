import { Resolver, ResolveField, Mutation, Query, Args, Context, ID, Parent } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { ObjectId } from "mongoose";

//Service
import { AddressService } from "./address.service";

//Dto
import { AddressInput } from "./dto/address.dto";
import { UpdateAddressInput } from "./dto/update.dto";

//Entities
import { SuccessInfo } from "src/user/entities/success.entity";
import { Address } from "./entities/address.entity";
import { User } from "src/user/entities/user.entity";

//Guard
import { AuthGuard } from "src/auth/auth.guard";

//Types
import { ReqUser } from "src/auth/types/user.types";

@Resolver(Address)
export class AddressResolver {
    //Constructor
    constructor(
        private readonly addressService: AddressService
    ) { };

    //Get Address
    @Query(() => [Address], { name: "getAddress" })
    @UseGuards(AuthGuard)
    get(
        @Context("user") reqUser: ReqUser
    ) {
        return this.addressService.get(reqUser);
    };

    //Add Address
    @Mutation(() => SuccessInfo, { name: "addAddress" })
    @UseGuards(AuthGuard)
    add(
        @Args("addressInput") addressInput: AddressInput,
        @Context("user") reqUser: ReqUser
    ) {
        return this.addressService.add(addressInput, reqUser);
    };

    //Update Address 
    @Mutation(() => SuccessInfo, { name: "updateAddress" })
    @UseGuards(AuthGuard)
    update(
        @Args("updateAddressInput") updateAddressInput: UpdateAddressInput,
        @Args("id", { type: () => ID }) id: ObjectId
    ) {
        return this.addressService.update(updateAddressInput, id);
    };

    // Mark address as Default
    @Mutation(() => SuccessInfo, { name: "markAddDefault" })
    @UseGuards(AuthGuard)
    mark(
        @Args("id", { type: () => ID }) id: ObjectId,
        @Context("user") reqUser: ReqUser
    ) {
        return this.addressService.mark(id, reqUser)
    };

    //Delete Address 
    @Mutation(() => SuccessInfo, { name: "deleteAddress" })
    @UseGuards(AuthGuard)
    delete(
        @Args("id", { type: () => ID }) id: ObjectId
    ) {
        return this.addressService.delete(id);
    }

    //Resolve field for Address query
    @ResolveField("user", () => User, { nullable: true })
    getUser(
        @Parent() address: Address,
        @Context() { loaders }: IGraphQLContext
    ) {
        return loaders.userLoader.load(address.user);
    }
}