import { InputType, Field, Float } from "@nestjs/graphql";
import { IsString, IsNumber, IsOptional } from "class-validator";

@InputType()
export class ShippingUpdateInput {
    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    name: string;

    @Field(() => Float, { nullable: true })
    @IsNumber()
    @IsOptional()
    rateInsideDhaka: number;

    @Field(() => Float, { nullable: true })
    @IsNumber()
    @IsOptional()
    rateOutsideDhaka: number;

    @Field(() => Float, { nullable: true })
    @IsNumber()
    @IsOptional()
    rateInSavar: number;

    @Field(() => String, { nullable: false })
    @IsString()
    @IsOptional()
    estimateDelivery: string

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    description: string;
}