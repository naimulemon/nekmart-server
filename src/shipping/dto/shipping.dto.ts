import { InputType, Field, Float } from "@nestjs/graphql";
import { IsString, IsNumber, IsNotEmpty, IsOptional } from "class-validator";

@InputType()
export class ShippingInput {
    @Field(() => String, { nullable: false })
    @IsString()
    @IsNotEmpty()
    name: string;

    @Field(() => Float, { nullable: false })
    @IsNumber()
    @IsNotEmpty()
    rateInsideDhaka: number;

    @Field(() => Float, { nullable: false })
    @IsNumber()
    @IsNotEmpty()
    rateOutsideDhaka: number;

    @Field(() => Float, { nullable: false })
    @IsNumber()
    @IsNotEmpty()
    rateInSavar: number;

    @Field(() => String, { nullable: false })
    @IsString()
    @IsNotEmpty()
    estimateDelivery: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    description: string;
}