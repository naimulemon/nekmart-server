import { InputType, Field, Float } from "@nestjs/graphql";
import { IsString, IsNotEmpty, IsNumber, IsEnum } from "class-validator";

@InputType()
export class CouponInput {
    @Field(() => String, { nullable: false })
    @IsString()
    @IsNotEmpty()
    name: string;

    @Field(() => String, { nullable: false })
    @IsString()
    @IsNotEmpty()
    code: string;

    @Field(() => Float, { nullable: false })
    @IsNumber()
    @IsNotEmpty()
    discount: number;

    @Field(() => String, { nullable: false })
    @IsString()
    @IsNotEmpty()
    @IsEnum(["flat", "percent"], { message: "Discount unit should be 'flat' and 'percent'!" })
    discountUnit: string;

    @Field(() => Float, { nullable: false })
    @IsNumber()
    @IsNotEmpty()
    minimumPurchase: string;

    @Field(() => String, { nullable: false })
    @IsString()
    @IsNotEmpty()
    expires: string;
}