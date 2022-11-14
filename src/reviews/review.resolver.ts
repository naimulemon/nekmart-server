import { Resolver, ResolveField, Parent, Mutation, Query, Args, Context, ID } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";

//Service
import { ReviewService } from "./review.service";

//Entities
import { SuccessInfo } from "src/user/entities/success.entity";
import { Review } from "./entities/reviews.entity";
import { User } from "src/user/entities/user.entity";
import { Product } from "src/product/entities/product.entity";
import { Seller } from "src/seller/entities/seller.entity";

//Dto
import { ReviewInput } from "./dto/review.dto";
import { CheckReviewInput } from "./dto/check.dto";
import { ReplyInput } from "./dto/reply.dto";

//Guard
import { Roles } from "src/auth/decorator/auth.decorator";
import { Role } from "src/auth/enum/auth.enum";
import { AuthGuard } from "src/auth/auth.guard";
import { RolesGuard } from "src/auth/roles.guard";

//Types
import { ReqUser } from "src/auth/types/user.types";


@Resolver(Review)
export class ReviewResolver {
    //Constructor
    constructor(
        private readonly reviewService: ReviewService
    ) { };

    //Get reviews by product
    @Query(() => [Review], { name: "getReviews" })
    getReviews(
        @Args("productSlug", { type: () => String }) productSlug: string
    ) {
        return this.reviewService.getReviews(productSlug);
    };

    //Get reviews by user
    @Query(() => [Review], { name: "getReviewByUser" })
    @UseGuards(AuthGuard)
    getReviewsByUser(
        @Context("user") reqUser: ReqUser
    ) {
        return this.reviewService.getReviewByUser(reqUser);
    };

    //Get reviews by seller
    @Query(() => [Review], { name: "getReviewBySeller" })
    @Roles(Role.SELLER)
    @UseGuards(AuthGuard, RolesGuard)
    getReviewBySeller(
        @Context("user") reqUser: ReqUser
    ) {
        return this.reviewService.getReviewBySeller(reqUser);
    }

    //Get reviews by admin
    @Query(() => [Review], { name: "getReviewByAdmin" })
    @Roles(Role.EDITOR, Role.MODERATOR, Role.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    getReviewByAdmin() {
        return this.reviewService.getReviewByAdmin();
    };

    //Add Reviews
    @Mutation(() => SuccessInfo, { name: "addReviews" })
    @UseGuards(AuthGuard)
    add(
        @Args("reviewInput") reviewInput: ReviewInput,
        @Context("user") reqUser: ReqUser
    ) {
        return this.reviewService.add(reviewInput, reqUser);
    };

    //Reply reviews
    @Mutation(() => SuccessInfo, { name: "replyReview" })
    @Roles(Role.SELLER)
    @UseGuards(AuthGuard, RolesGuard)
    reply(
        @Args("replyInput") replyInput: ReplyInput
    ) {
        return this.reviewService.reply(replyInput);
    }

    // Check review is available
    @Mutation(() => SuccessInfo, { name: "reviewAvailability" })
    @UseGuards(AuthGuard)
    check(
        @Args("checkReviewInput") checkReviewInput: CheckReviewInput,
        @Context("user") reqUser: ReqUser
    ) {
        return this.reviewService.check(checkReviewInput, reqUser);
    };

    //Resolve field for user in get query
    @ResolveField("user", () => User, { nullable: true })
    getUser(
        @Parent() review: Review,
        @Context() { loaders }: IGraphQLContext
    ) {
        return loaders.userLoader.load(review.user);
    }

    //Resolve field for product in get query
    @ResolveField("product", () => Product, { nullable: true })
    getProduct(
        @Parent() review: Review,
        @Context() { loaders }: IGraphQLContext
    ) {
        return loaders.productLoader.load(review.product);
    }

    //Resolve field for seller in get query
    @ResolveField("seller", () => Seller, { nullable: true })
    getSeller(
        @Parent() review: Review,
        @Context() { loaders }: IGraphQLContext
    ) {
        return loaders.sellerLoader.load(review.seller);
    }
}