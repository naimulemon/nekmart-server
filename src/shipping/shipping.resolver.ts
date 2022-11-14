import { Resolver, Mutation, Query, Args, ID } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { ObjectId } from "mongoose";

//Service
import { ShippingService } from "./shipping.service";

//Entities
import { SuccessInfo } from "src/user/entities/success.entity";
import { Shipping } from "./entities/shipping.entity";

//Dto
import { ShippingInput } from "./dto/shipping.dto";
import { ShippingUpdateInput } from "./dto/update.dto";

//Guards
import { Roles } from "src/auth/decorator/auth.decorator";
import { Role } from "src/auth/enum/auth.enum";
import { AuthGuard } from "src/auth/auth.guard";
import { RolesGuard } from "src/auth/roles.guard";

@Resolver()
export class ShippingResolver {
    //Constructor
    constructor(
        private readonly shippingService: ShippingService
    ) { };

    //Get Shipping
    @Query(() => [Shipping], { name: "getShippings" })
    @UseGuards(AuthGuard)
    get() {
        return this.shippingService.get()
    }

    //Get Single shipping
    @Query(() => Shipping, { name: "getShipping" })
    @UseGuards(AuthGuard)
    getSingle(
        @Args("slug", { type: () => String }) slug: string
    ) {
        return this.shippingService.getSingle(slug);
    }

    //Add Shipping
    @Mutation(() => SuccessInfo, { name: "addShipping" })
    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    add(
        @Args("shippingInput") shippingInput: ShippingInput
    ) {
        return this.shippingService.add(shippingInput);
    }

    //Update Shipping
    @Mutation(() => SuccessInfo, { name: "updateShipping" })
    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    update(
        @Args("shippingUpdateInput") shippingUpdateInput: ShippingUpdateInput,
        @Args("id", { type: () => ID }) id: ObjectId
    ) {
        return this.shippingService.update(shippingUpdateInput, id);
    }

    //Delete Shipping
    @Mutation(() => SuccessInfo, { name: "deleteShipping" })
    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    delete(
        @Args("id", { type: () => ID }) id: ObjectId
    ) {
        return this.shippingService.delete(id);
    }
}