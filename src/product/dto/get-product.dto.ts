import { InputType, Field, Float } from "@nestjs/graphql";
import { IsString, IsNumber, IsArray, IsOptional, IsBoolean } from "class-validator";

@InputType()
export class ProductPrams {
    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    search: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    seller: string;

    @Field(() => Float, { nullable: true })
    @IsNumber()
    @IsOptional()
    limit: number;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    skip: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    order: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    sortBy: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    category: string;

    @Field(() => [String], { nullable: true })
    @IsArray()
    @IsOptional()
    subCategory: string[];

    @Field(() => [String], { nullable: true })
    @IsArray()
    @IsOptional()
    treeCategory: string[];

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    brand: string;

    @Field(() => [Float], { nullable: true })
    @IsArray()
    @IsOptional()
    price: number[];

    @Field(() => Boolean, { nullable: true })
    @IsBoolean()
    @IsOptional()
    visibility: boolean;


    @Field(() => Boolean, { nullable: true })
    @IsBoolean()
    @IsOptional()
    approved: boolean;
}