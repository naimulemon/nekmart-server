import { ObjectType, Field, HideField, ID, Float } from "@nestjs/graphql";
import { ObjectId } from "mongoose";

//Date-scalar
import { DateScalar } from "src/date.scalar";

@ObjectType()
export class Cart {
    @Field(() => ID, { nullable: false })
    id: ObjectId;
    @HideField()
    product: ObjectId
    @HideField()
    user: ObjectId;
    @HideField()
    seller: ObjectId;
    @Field(() => Float, { nullable: false })
    quantity: number;
    @Field(() => Float, { nullable: true })
    minPurchase: number;
    @Field(() => Float, { nullable: false })
    amount: number;
    @Field(() => String, { nullable: true })
    variation: string;
    @Field(() => Date, { nullable: false })
    createdAt: DateScalar;
    @Field(() => Date, { nullable: false })
    updatedAt: DateScalar;
}