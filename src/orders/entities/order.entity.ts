import { ObjectType, Field, HideField, Float, ID } from "@nestjs/graphql";
import { ObjectId } from "mongoose";

//Data-scalar
import { DateScalar } from "src/date.scalar";

@ObjectType()
export class PaymentInfo {
    @Field(() => String, { nullable: true })
    paymentType: string;
    @Field(() => String, { nullable: true })
    paymentId: string;
    @Field(() => String, { nullable: true })
    provider: string;
}

@ObjectType()
export class SubProductInfo {
    @HideField()
    productId: ObjectId;
    @Field(() => Float, { nullable: false })
    quantity: number;
    @Field(() => String, { nullable: false })
    variation: string;
    @Field(() => Float, { nullable: true })
    tax: number;
}

@ObjectType()
export class OrderProductInfo {
    @HideField()
    seller: ObjectId;
    @Field(() => [SubProductInfo], { nullable: true })
    products: SubProductInfo[];
    @Field(() => Float, { nullable: false })
    price: number;
    @Field(() => String, { nullable: true })
    status: string;
    @Field(() => String, { nullable: true })
    cancelBy: string;
}

@ObjectType()
export class Order {
    @Field(() => ID, { nullable: false })
    id: ObjectId;
    @Field(() => String, { nullable: false })
    orderId: string;
    @HideField()
    user: ObjectId;
    @HideField()
    shippingAddress: ObjectId;
    @HideField()
    billingAddress: ObjectId;
    @Field(() => [OrderProductInfo], { nullable: true })
    productInfo: OrderProductInfo[];
    @Field(() => Float, { nullable: false })
    total: number;
    @Field(() => Float, { nullable: false })
    shippingFees: number;
    @Field(() => Float, { nullable: false })
    couponDiscount: number;
    @Field(() => Float, { nullable: false })
    subtotal: number;
    @Field(() => PaymentInfo, { nullable: true })
    paymentInfo: PaymentInfo;
    @Field(() => String, { nullable: false })
    paymentMethod: string;
    @Field(() => String, { nullable: true })
    note: string;
    @Field(() => Date, { nullable: false })
    createdAt: DateScalar;
    @Field(() => Date, { nullable: false })
    updatedAt: DateScalar;
}