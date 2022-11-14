import { Field, ObjectType, Float } from "@nestjs/graphql";

@ObjectType()
export class AdminAnalytics {
    @Field(() => Float, { nullable: true })
    totalProduct: number;
    @Field(() => Float, { nullable: true })
    totalSeller: number;
    @Field(() => Float, { nullable: true })
    totalOrder: number;
    @Field(() => Float, { nullable: true })
    successfulOrder: number;
    @Field(() => Float, { nullable: true })
    pendingOrder: number;
    @Field(() => Float, { nullable: true })
    pendingProducts: number;
    @Field(() => Float, { nullable: true })
    pendingSeller: number;
    @Field(() => Float, { nullable: true })
    totalUser: number;
    @Field(() => Float, { nullable: true })
    cancelledOrder: number;
}