import { ObjectType, Field, HideField, ID } from "@nestjs/graphql";
import { ObjectId } from "mongoose";

//Date Scalar
import { DateScalar } from "src/date.scalar";

@ObjectType()
export class TreeCategory {
    @Field(() => ID, { nullable: false })
    id: ObjectId;
    @Field(() => String, { nullable: false })
    name: string;
    @Field(() => String, { nullable: false })
    slug: string;
    @HideField()
    subCategory: ObjectId;
    @Field(() => Date, { nullable: false })
    createdAt: DateScalar;
    @Field(() => Date, { nullable: false })
    updatedAt: DateScalar;
}