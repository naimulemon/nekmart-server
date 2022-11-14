import { ObjectType, Field, ID, Float, HideField } from "@nestjs/graphql";
import { ObjectId } from "mongoose";

//Date Scalar
import { DateScalar } from "src/date.scalar";

@ObjectType()
export class Income {
    @Field(() => ID, { nullable: true })
    id: ObjectId;
    @HideField()
    seller: ObjectId;
    @HideField()
    user: ObjectId;
    @Field(() => Float, { nullable: true })
    income: number;
    @Field(() => Boolean, { nullable: true })
    paySuccess: boolean;
    @Field(() => String, { nullable: true })
    refunded: string;
    @Field(() => Date, { nullable: false })
    createdAt: DateScalar;
    @Field(() => Date, { nullable: false })
    updatedAt: DateScalar;
}
