import { Resolver, ResolveField, Parent, Mutation, Query, Args, Context, ID } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { ObjectId } from "mongoose";

//Service
import { WishlistService } from "./wishlist.service";

//Entities
import { SuccessInfo } from "src/user/entities/success.entity";
import { Wishlist } from "./entities/wishlist.entity";
import { User } from "src/user/entities/user.entity";
import { Product } from "src/product/entities/product.entity";

//Dto
import { WishlistInput } from "./dto/wishlist.dto";

//Guard
import { AuthGuard } from "src/auth/auth.guard";

//Req User Types
import { ReqUser } from "src/auth/types/user.types";

@Resolver(Wishlist)
export class WishlistResolver {
    //Constructor
    constructor(
        private readonly wishlistService: WishlistService
    ) { };

    //Get wishlist
    @Query(() => [Wishlist], { name: "getWishlist" })
    @UseGuards(AuthGuard)
    get(
        @Context("user") reqUser: ReqUser
    ) {
        return this.wishlistService.get(reqUser);
    }

    //Add Wishlist
    @Mutation(() => SuccessInfo, { name: "addWishlist" })
    @UseGuards(AuthGuard)
    add(
        @Args("wishlistInput") wishlistInput: WishlistInput,
        @Context("user") reqUser: ReqUser
    ) {
        return this.wishlistService.add(wishlistInput, reqUser);
    }

    //Delete Wishlist
    @Mutation(() => SuccessInfo, { name: "deleteWishlist" })
    @UseGuards(AuthGuard)
    delete(
        @Args("id", { type: () => ID }) id: ObjectId
    ) {
        return this.wishlistService.delete(id);
    }

    //Resolve field for user in get query
    @ResolveField("user", () => User, { nullable: true })
    getUser(
        @Parent() wishlist: Wishlist,
        @Context() { loaders }: IGraphQLContext
    ) {
        return loaders.userLoader.load(wishlist.user);
    }

    //Resolve field for product in get query
    @ResolveField("product", () => Product, { nullable: false })
    getProduct(
        @Parent() wishlist: Wishlist,
        @Context() { loaders }: IGraphQLContext
    ) {
        return loaders.productLoader.load(wishlist.product);
    }
}