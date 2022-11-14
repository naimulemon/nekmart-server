import { ObjectType, Field, HideField, ID } from "@nestjs/graphql";
import { ObjectId } from "mongoose";

//Date-scalar
import { DateScalar } from "src/date.scalar";

@ObjectType()
export class Wishlist {
    @Field(() => ID, { nullable: false })
    id: ObjectId;
    @HideField()
    user: ObjectId;
    @HideField()
    product: ObjectId;
    @Field(() => Date, { nullable: false })
    createdAt: DateScalar;
    @Field(() => Date, { nullable: false })
    updatedAt: DateScalar;
}