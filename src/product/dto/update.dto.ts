import { InputType, Field, ID, Float } from "@nestjs/graphql";
import { IsString, IsBoolean, IsOptional, IsNotEmpty, IsNumber, IsEnum, IsArray, IsObject, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { ObjectId } from "mongoose";

//Other input types
import { ProductImageInput, ProductAttributeInput, ProductMetaInput, ProductSpecificationInput } from "./product.dto";

@InputType()
export class ProductUpdateInput {
    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    name: string;

    @Field(() => ID, { nullable: true })
    @IsString()
    @IsOptional()
    category: ObjectId;

    @Field(() => ID, { nullable: true })
    @IsString()
    @IsOptional()
    subCategory: ObjectId;

    @Field(() => [ID], { nullable: true })
    @IsArray()
    @IsOptional()
    treeCategory: ObjectId[];

    @Field(() => ID, { nullable: true })
    @IsString()
    @IsOptional()
    brand: ObjectId;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    unit: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    minPurchase: string;

    @Field(() => [ID], { nullable: true })
    @IsArray()
    @IsOptional()
    tag: ObjectId[];

    @Field(() => Boolean, { nullable: true })
    @IsBoolean()
    @IsOptional()
    refundAble: boolean;

    @Field(() => Boolean, { nullable: true })
    @IsBoolean()
    @IsOptional()
    digitalProduct: boolean;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    productFile: string;

    @Field(() => [ProductImageInput], { nullable: true })
    @IsArray()
    @IsOptional()
    @ValidateNested()
    @Type(() => ProductImageInput)
    productImages: ProductImageInput[];

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    youtubeLink: string;

    @Field(() => Float, { nullable: false })
    @IsNumber()
    @IsNotEmpty()
    price: number;

    @Field(() => ID, { nullable: true })
    @IsString()
    @IsOptional()
    flash: ObjectId;

    @Field(() => Float, { nullable: false })
    @IsNumber()
    @IsNotEmpty()
    discount: number;

    @Field(() => String, { nullable: false })
    @IsString()
    @IsEnum(["flat", "percent"], { message: "Discount unit will be only 'flat' and 'percent'!" })
    discountUnit: string;

    @Field(() => Float, { nullable: true })
    @IsNumber()
    @IsOptional()
    quantity: number;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    description: string;

    @Field(() => [ProductAttributeInput], { nullable: true })
    @IsArray()
    @IsOptional()
    @ValidateNested()
    @Type(() => ProductAttributeInput)
    attributes: ProductAttributeInput[];

    @Field(() => [ProductSpecificationInput], { nullable: true })
    @IsArray()
    @IsOptional()
    @ValidateNested()
    @Type(() => ProductSpecificationInput)
    specification: ProductSpecificationInput[];

    @Field(() => Boolean, { nullable: true })
    @IsBoolean()
    @IsOptional()
    visibility: boolean;

    @Field(() => ProductMetaInput, { nullable: true })
    @IsObject()
    @IsOptional()
    @ValidateNested()
    @Type(() => ProductMetaInput)
    meta: ProductMetaInput;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    shippingDays: string;

    @Field(() => Boolean, { nullable: true })
    @IsBoolean()
    @IsOptional()
    showStock: boolean;

    @Field(() => Float, { nullable: false })
    @IsNumber()
    @IsNotEmpty()
    tax: number;

    @Field(() => String, { nullable: false })
    @IsString()
    @IsNotEmpty()
    @IsEnum(["flat", "percent"], { message: "Tax unit can be only 'flat' and 'percent'!" })
    taxUnit: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    disclaimer: string;
}