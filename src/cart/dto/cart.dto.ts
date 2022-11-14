import { InputType, Field, Float, ID } from "@nestjs/graphql";
import { IsString, IsNotEmpty, IsNumber, Min, IsOptional } from "class-validator";
import { ObjectId } from "mongoose";

@InputType()
export class CartInput {
    @Field(() => ID, { nullable: false })
    @IsString()
    @IsNotEmpty()
    product: ObjectId;

    @Field(() => ID, { nullable: false })
    @IsString()
    @IsNotEmpty()
    seller: ObjectId;

    @Field(() => Float, { nullable: false })
    @IsNumber()
    @IsNotEmpty()
    @Min(1)
    quantity: number;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    minPurchase: string;

    @Field(() => Float, { nullable: false })
    @IsNumber()
    @IsNotEmpty()
    amount: number;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    variation: string;
}