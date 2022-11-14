import { Resolver, ResolveField, Parent, Query, Context } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";


//Service
import { PointService } from "./points.service";

//Entities
import { PointsHistory, Points } from "./entities/points.entity";
import { Order } from "src/orders/entities/order.entity";

//Guards
import { AuthGuard } from "src/auth/auth.guard";

//Types
import { ReqUser } from "src/auth/types/user.types";

@Resolver(PointsHistory)
export class PointResolver {
    //Constructor
    constructor(
        private readonly pointService: PointService
    ) { };

    //Get points
    @Query(() => Points, { name: "getPoints" })
    @UseGuards(AuthGuard)
    get(
        @Context("user") reqUser: ReqUser
    ) {
        return this.pointService.get(reqUser);
    }

    //Resolve field for order in get query
    @ResolveField("order", () => Order, { nullable: true })
    getOrder(
        @Parent() history: PointsHistory,
        @Context() { loaders }: IGraphQLContext
    ) {
        return loaders.ordersLoader.load(history.order);
    }
}