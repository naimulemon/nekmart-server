import { ObjectType, HideField, Field, Float, ID } from "@nestjs/graphql";
import { ObjectId } from "mongoose";

//Date-scalar
import { DateScalar } from "src/date.scalar";

@ObjectType()
export class RefundProducts {
    @HideField()
    productId: ObjectId;
    @Field(() => Float, { nullable: false })
    quantity: number;
}

@ObjectType()
export class Refund {
    @Field(() => ID, { nullable: false })
    id: ObjectId;
    @HideField()
    orderId: ObjectId;
    @HideField()
    user: ObjectId;
    @HideField()
    seller: ObjectId;
    @Field(() => [RefundProducts], { nullable: true })
    products: RefundProducts[];
    @HideField()
    address: ObjectId;
    @Field(() => String, { nullable: false })
    reason: string;
    @Field(() => String, { nullable: false })
    description: string;
    @Field(() => String, { nullable: false })
    status: string;
    @Field(() => Date, { nullable: false })
    createdAt: DateScalar;
    @Field(() => Date, { nullable: false })
    updatedAt: DateScalar;
}