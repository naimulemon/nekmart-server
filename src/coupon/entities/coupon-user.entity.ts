import { ObjectType, Field, ID, Float } from "@nestjs/graphql";
import { ObjectId } from "mongoose";

//Date-scalar
import { DateScalar } from "src/date.scalar";

@ObjectType()
export class CouponUser {
    @Field(() => ID, { nullable: false })
    id: ObjectId;
    @Field(() => String, { nullable: false })
    code: string;
    @Field(() => Float, { nullable: false })
    discount: number;
    @Field(() => String, { nullable: false })
    discountUnit: string;
    @Field(() => Float, { nullable: false })
    points: number;
    @Field(() => Date, { nullable: false })
    createdAt: DateScalar
    @Field(() => Date, { nullable: false })
    updatedAt: DateScalar
}