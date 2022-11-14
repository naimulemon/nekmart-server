import { ObjectType, Field, HideField, ID, Float } from "@nestjs/graphql";
import { ObjectId } from "mongoose";

//Date-scalar
import { DateScalar } from "src/date.scalar";

@ObjectType()
class ReviewImage {
    @Field(() => String, { nullable: true })
    url: string;
}

@ObjectType()
export class Review {
    @Field(() => ID, { nullable: false })
    id: ObjectId;
    @HideField()
    user: ObjectId;
    @HideField()
    seller: ObjectId;
    @HideField()
    product: ObjectId;
    @Field(() => [ReviewImage], { nullable: true })
    image: ReviewImage[]
    @Field(() => String, { nullable: false })
    comment: string;
    @Field(() => String, { nullable: true })
    reply: string;
    @Field(() => Float, { nullable: false })
    rate: number;
    @Field(() => Date, { nullable: false })
    createdAt: DateScalar;
    @Field(() => Date, { nullable: false })
    updatedAt: DateScalar;
}