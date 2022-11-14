import { Resolver, ResolveField, Parent, Mutation, Query, Args, Context, ID } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { ObjectId } from "mongoose";

//Service
import { RefundService } from "./refund.service";

//Dto
import { RefundInput } from "./dto/refund.dto";
import { RefundStatusInput } from "./dto/status.dto";

//Entities
import { SuccessInfo } from "src/user/entities/success.entity";
import { Refund, RefundProducts } from "./entities/refund.entity";
import { Product } from "src/product/entities/product.entity";
import { Order } from "src/orders/entities/order.entity";
import { User } from "src/user/entities/user.entity";
import { Seller } from "src/seller/entities/seller.entity";
import { Address } from "src/address/entities/address.entity";

//Guard
import { Roles } from "src/auth/decorator/auth.decorator";
import { Role } from "src/auth/enum/auth.enum";
import { AuthGuard } from "src/auth/auth.guard";
import { RolesGuard } from "src/auth/roles.guard";

//Types
import { ReqUser } from "src/auth/types/user.types";

@Resolver(Refund)
export class RefundResolver {
    //Constructor
    constructor(
        private readonly refundService: RefundService
    ) { };

    //Get Refund by user
    @Query(() => [Refund], { name: "getRefundByUser" })
    @UseGuards(AuthGuard)
    getByUser(
        @Context("user") reqUser: ReqUser
    ) {
        return this.refundService.getByUser(reqUser);
    };

    //Get Refund by Admin
    @Query(() => [Refund], { name: "getRefundByAdmin" })
    @Roles(Role.EDITOR, Role.MODERATOR, Role.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    getByAdmin() {
        return this.refundService.getByAdmin();
    }

    //Get single refund by admin
    @Query(() => Refund, { name: "getSingleRefundByAdmin" })
    @Roles(Role.EDITOR, Role.MODERATOR, Role.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    getSingle(
        @Args("id", { type: () => ID }) id: ObjectId
    ) {
        return this.refundService.getSingle(id);
    }

    //Add Refund
    @Mutation(() => SuccessInfo, { name: "addRefund" })
    @UseGuards(AuthGuard)
    add(
        @Args("refundInput") refundInput: RefundInput,
        @Context("user") reqUser: ReqUser
    ) {
        return this.refundService.add(refundInput, reqUser);
    };

    //Change
    @Mutation(() => SuccessInfo, { name: "changeRefundStatus" })
    @Roles(Role.EDITOR, Role.MODERATOR, Role.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    change(
        @Args("id", { type: () => ID }) id: ObjectId,
        @Args("refundStatusInput") refundStatusInput: RefundStatusInput
    ) {
        return this.refundService.change(id, refundStatusInput);
    };

    //Resolve field for order in get query
    @ResolveField("order", () => Order, { nullable: true })
    getOrder(
        @Parent() refund: Refund,
        @Context() { loaders }: IGraphQLContext
    ) {
        return loaders.ordersLoader.load(refund.orderId);
    }

    //Resolve field for user in get query
    @ResolveField("user", () => User, { nullable: true })
    getUser(
        @Parent() refund: Refund,
        @Context() { loaders }: IGraphQLContext
    ) {
        return loaders.userLoader.load(refund.user);
    }

    //Resolve field for seller in get query
    @ResolveField("seller", () => Seller, { nullable: true })
    getSeller(
        @Parent() refund: Refund,
        @Context() { loaders }: IGraphQLContext
    ) {
        return loaders.sellerLoader.load(refund.seller);
    }

    //Resolve field for address in get query
    @ResolveField("address", () => Address, { nullable: true })
    getAddress(
        @Parent() refund: Refund,
        @Context() { loaders }: IGraphQLContext
    ) {
        return loaders.addressLoader.load(refund.address);
    }
}


@Resolver(RefundProducts)
export class RefundProductsResolver {
    //Resolve field for products in get query
    @ResolveField("products", () => Product, { nullable: true })
    getAddress(
        @Parent() refund: RefundProducts,
        @Context() { loaders }: IGraphQLContext
    ) {
        return loaders.productLoader.load(refund.productId);
    }
}