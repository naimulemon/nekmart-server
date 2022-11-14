import { InputType, Field, Float } from "@nestjs/graphql";
import { IsString, IsOptional, IsNumber } from "class-validator";

@InputType()
export class FlashUpdateInput {
    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    title: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    image: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    thumb: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    start: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    expires: string;

    @Field(() => Float, { nullable: true })
    @IsNumber()
    @IsOptional()
    discount: number;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    discountUnit: string;
}