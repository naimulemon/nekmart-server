import { ObjectType, Field, HideField, Float, ID } from "@nestjs/graphql";
import { ObjectId } from "mongoose";
import { DateScalar } from "src/date.scalar";

@ObjectType()
export class Withdraw {
    @Field(() => ID, { nullable: false })
    id: ObjectId;
    @HideField()
    seller: ObjectId;
    @Field(() => Float, { nullable: false })
    amount: number;
    @Field(() => String, { nullable: false })
    releasedBy: string;
    @Field(() => String, { nullable: false })
    method: string;
    @Field(() => String, { nullable: false })
    status: string;
    @Field(() => Date, { nullable: false })
    createdAt: DateScalar;
    @Field(() => Date, { nullable: false })
    updatedAt: DateScalar;
}
