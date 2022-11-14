import { ObjectType, Field, ID, Float } from "@nestjs/graphql";
import { ObjectId } from "mongoose";

//Date-scalar
import { DateScalar } from "src/date.scalar";

@ObjectType()
export class CouponAdmin {
    @Field(() => ID, { nullable: false })
    id: ObjectId;
    @Field(() => String, { nullable: false })
    name: string;
    @Field(() => String, { nullable: false })
    slug: string;
    @Field(() => String, { nullable: false })
    code: string;
    @Field(() => Float, { nullable: false })
    discount: number;
    @Field(() => String, { nullable: false })
    discountUnit: string;
    @Field(() => Float, { nullable: false })
    minimumPurchase: number;
    @Field(() => Date, { nullable: false })
    expires: DateScalar
    @Field(() => Date, { nullable: false })
    createdAt: DateScalar
    @Field(() => Date, { nullable: false })
    updatedAt: DateScalar
}