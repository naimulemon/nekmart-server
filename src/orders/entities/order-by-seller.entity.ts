import { ObjectType, Field, HideField, ID } from "@nestjs/graphql";
import { ObjectId } from "mongoose";

//Data-scalar
import { DateScalar } from "src/date.scalar";

//All Entities
import { OrderProductInfo, PaymentInfo } from "./order.entity";

@ObjectType()
export class OrderBySeller {
    @Field(() => ID, { nullable: false })
    _id: ObjectId;
    @Field(() => String, { nullable: false })
    orderId: string;
    @HideField()
    user: ObjectId;
    @HideField()
    shippingAddress: ObjectId;
    @HideField()
    billingAddress: ObjectId;
    @Field(() => OrderProductInfo, { nullable: true })
    productInfo: OrderProductInfo;
    @Field(() => PaymentInfo, { nullable: true })
    paymentInfo: PaymentInfo;
    @Field(() => Date, { nullable: false })
    createdAt: DateScalar;
    @Field(() => Date, { nullable: false })
    updatedAt: DateScalar;
}