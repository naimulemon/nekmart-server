import { InputType, Field, Float } from "@nestjs/graphql";
import { IsNumber, IsNotEmpty } from "class-validator";

@InputType()
export class RedeemInput {
    @Field(() => Float, { nullable: false })
    @IsNumber()
    @IsNotEmpty()
    discount: number;

    @Field(() => Float, { nullable: false })
    @IsNumber()
    @IsNotEmpty()
    points: number;

    @Field(() => Float, { nullable: false })
    @IsNumber()
    @IsNotEmpty()
    minPurchase: number;
}