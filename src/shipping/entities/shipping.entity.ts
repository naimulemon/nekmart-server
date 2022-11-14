import { ObjectType, Field, Float, ID } from "@nestjs/graphql";
import { ObjectId } from "mongoose";

//Data-scalar
import { DateScalar } from "src/date.scalar";

@ObjectType()
export class Shipping {
    @Field(() => ID, { nullable: false })
    id: ObjectId;
    @Field(() => String, { nullable: false })
    name: string;
    @Field(() => String, { nullable: false })
    slug: string;
    @Field(() => Float, { nullable: false })
    rateInsideDhaka: number;
    @Field(() => Float, { nullable: false })
    rateOutsideDhaka: number;
    @Field(() => Float, { nullable: false })
    rateInSavar: number;
    @Field(() => String, { nullable: false })
    estimateDelivery: string;
    @Field(() => String, { nullable: false })
    description: string;
    @Field(() => Date, { nullable: false })
    createdAt: DateScalar;
    @Field(() => Date, { nullable: false })
    updatedAt: DateScalar;
}