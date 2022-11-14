import { Resolver, ResolveField, Parent, Mutation, Query, Args, Context, ID } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { ObjectId } from "mongoose";

//Service
import { CartService } from "./cart.service";

//Dto
import { CartInput } from "./dto/cart.dto";

//Entities
import { SuccessInfo } from "src/user/entities/success.entity";
import { Cart } from "./entities/cart.entity";
import { Seller } from "src/seller/entities/seller.entity";
import { Product } from "src/product/entities/product.entity";
import { User } from "src/user/entities/user.entity";
import { IncreaseInfo } from "./entities/increase.entity";

//Guard
import { AuthGuard } from "src/auth/auth.guard";

//Types
import { ReqUser } from "src/auth/types/user.types";

@Resolver(Cart)
export class CartResolver {
    //Constructor
    constructor(
        private readonly cartService: CartService
    ) { };

    //Get Carts
    @Query(() => [Cart], { name: "getCarts" })
    @UseGuards(AuthGuard)
    get(
        @Context("user") reqUser: ReqUser
    ) {
        return this.cartService.get(reqUser);
    };

    //Has cart
    @Query(() => SuccessInfo, { name: "hasCart" })
    @UseGuards(AuthGuard)
    has(
        @Context("user") reqUser: ReqUser
    ) {
        return this.cartService.has(reqUser)
    }

    //Add Cart
    @Mutation(() => SuccessInfo, { name: "addCart" })
    @UseGuards(AuthGuard)
    add(
        @Args("cartInput") cartInput: CartInput,
        @Context("user") reqUser: ReqUser
    ) {
        return this.cartService.add(cartInput, reqUser);
    };

    //Increase cart quantity
    @Mutation(() => IncreaseInfo, { name: "increaseCart" })
    @UseGuards(AuthGuard)
    increase(
        @Args("id", { type: () => ID }) id: ObjectId,
        @Context("user") reqUser: ReqUser
    ) {
        return this.cartService.increase(id, reqUser);
    };

    //Decrease cart quantity
    @Mutation(() => SuccessInfo, { name: "decreaseCart" })
    @UseGuards(AuthGuard)
    decrease(
        @Args("id", { type: () => ID }) id: ObjectId,
        @Context("user") reqUser: ReqUser
    ) {
        return this.cartService.decrease(id, reqUser);
    };

    //Delete Cart 
    @Mutation(() => SuccessInfo, { name: "deleteCart" })
    @UseGuards(AuthGuard)
    delete(
        @Args("id", { type: () => ID }) id: ObjectId,
        @Context("user") reqUser: ReqUser
    ) {
        return this.cartService.delete(id, reqUser);
    };

    //Resolve field for seller in cart query
    @ResolveField("seller", () => Seller, { nullable: true })
    getSeller(
        @Parent() cart: Cart,
        @Context() { loaders }: IGraphQLContext
    ) {
        return loaders.sellerLoader.load(cart.seller);
    }

    //Resolve field for Product in Cart query
    @ResolveField("product", () => Product, { nullable: true })
    getProduct(
        @Parent() cart: Cart,
        @Context() { loaders }: IGraphQLContext
    ) {
        return loaders.productLoader.load(cart.product);
    }

    //Resolve field for User in Cart query
    @ResolveField("user", () => User, { nullable: true })
    getUser(
        @Parent() cart: Cart,
        @Context() { loaders }: IGraphQLContext
    ) {
        return loaders.userLoader.load(cart.user)
    }
}