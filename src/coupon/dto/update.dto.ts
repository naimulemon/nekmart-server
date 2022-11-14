import { InputType, Field, Float } from "@nestjs/graphql";
import { IsString, IsOptional, IsNumber, IsEnum } from "class-validator";

@InputType()
export class CouponUpdateInput {
    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    name: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    code: string;

    @Field(() => Float, { nullable: true })
    @IsNumber()
    @IsOptional()
    discount: number;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsEnum(["flat", "percent"], { message: "Discount unit should be 'flat' and 'percent'!" })
    @IsOptional()
    discountUnit: string;

    @Field(() => Float, { nullable: true })
    @IsNumber()
    @IsOptional()
    minimumPurchase: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    expires: string;
}