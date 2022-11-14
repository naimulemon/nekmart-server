import { ObjectType, Field, Float } from "@nestjs/graphql";

@ObjectType()
export class SellerAnalytics {
    @Field(() => Float, { nullable: true })
    totalProduct: number;
    @Field(() => Float, { nullable: true })
    totalSale: number;
    @Field(() => Float, { nullable: true })
    totalSaleMoney: number
    @Field(() => Float, { nullable: true })
    successfulOrder: number;
    @Field(() => Float, { nullable: true })
    currentIncome: number;
    @Field(() => Float, { nullable: true })
    upcomingWithdraw: number;
    @Field(() => Float, { nullable: true })
    lastMonthIncome: number;
    @Field(() => Float, { nullable: true })
    totalRatting: number;
    @Field(() => Float, { nullable: true })
    pendingWithdraw: number;
    @Field(() => Float, { nullable: true })
    runningCampaign: number;
    @Field(() => Float, { nullable: true })
    cancelledOrder: number;
}