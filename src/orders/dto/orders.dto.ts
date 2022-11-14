import { InputType, Field, Float, ID } from "@nestjs/graphql";
import { IsString, IsNumber, IsNotEmpty, IsOptional, IsArray, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { ObjectId } from "mongoose";


@InputType()
export class PaymentInput {
    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    paymentType: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    paymentId: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    provider: string;
}

@InputType()
export class InfoProductsInputs {
    @Field(() => ID, { nullable: false })
    @IsString()
    @IsNotEmpty()
    productId: ObjectId;

    @Field(() => Float, { nullable: false })
    @IsNumber()
    @IsNotEmpty()
    quantity: number;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    variation: string;

    @Field(() => Float, { nullable: false })
    @IsNumber()
    @IsNotEmpty()
    tax: number;
}

@InputType()
export class OrderProductInfoInput {
    @Field(() => ID, { nullable: false })
    @IsString()
    @IsNotEmpty()
    seller: ObjectId;

    @Field(() => [InfoProductsInputs], { nullable: true })
    @IsArray()
    @ValidateNested()
    @Type(() => InfoProductsInputs)
    products: InfoProductsInputs[];

    @Field(() => Float, { nullable: false })
    @IsNumber()
    @IsNotEmpty()
    price: number;
}

@InputType()
export class OrderInput {
    @Field(() => ID, { nullable: false })
    @IsString()
    @IsNotEmpty()
    shippingAddress: ObjectId;

    @Field(() => ID, { nullable: false })
    @IsString()
    @IsNotEmpty()
    billingAddress: ObjectId;

    @Field(() => [OrderProductInfoInput], { nullable: true })
    @IsArray()
    @ValidateNested()
    @Type(() => OrderProductInfoInput)
    productInfo: OrderProductInfoInput[];

    @Field(() => [ID], { nullable: false })
    @IsArray()
    @IsNotEmpty()
    carts: ObjectId[]

    @Field(() => Float, { nullable: false })
    @IsNumber()
    @IsNotEmpty()
    total: number;

    @Field(() => Float, { nullable: false })
    @IsNumber()
    @IsNotEmpty()
    shippingFees: number;

    @Field(() => Float, { nullable: false })
    @IsNumber()
    @IsNotEmpty()
    couponDiscount: number;

    @Field(() => Float, { nullable: false })
    @IsNumber()
    @IsNotEmpty()
    subtotal: number;

    @Field(() => PaymentInput, { nullable: true })
    @IsOptional()
    @ValidateNested()
    @Type(() => PaymentInput)
    paymentInfo: PaymentInput;

    @Field(() => String, { nullable: false })
    @IsString()
    @IsNotEmpty()
    paymentMethod: String;
}