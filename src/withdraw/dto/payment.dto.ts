import { InputType, Field, Float, ID } from "@nestjs/graphql";
import { IsString, IsNotEmpty, IsNumber, IsArray } from "class-validator";
import { ObjectId } from "mongoose";

@InputType()
export class ReleasePaymentInput {
    @Field(() => ID, { nullable: false })
    @IsString()
    @IsNotEmpty()
    seller: ObjectId

    @Field(() => Float, { nullable: false })
    @IsNumber()
    @IsNotEmpty()
    amount: number;

    @Field(() => String, { nullable: false })
    @IsString()
    @IsNotEmpty()
    method: string;

    @Field(() => [ID], { nullable: false })
    @IsArray()
    @IsNotEmpty()
    incomesIds: ObjectId[];
}