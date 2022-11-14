import { InputType, Field, ID, Float } from "@nestjs/graphql";
import { IsString, IsNotEmpty, IsNumber, IsArray, ValidateNested, IsOptional } from "class-validator";
import { Type } from "class-transformer";
import { ObjectId } from "mongoose";

@InputType()
class ReviewImageInput {
    @Field(() => String, { nullable: true })
    url: string;
}

@InputType()
export class ReviewInput {
    @Field(() => ID, { nullable: false })
    @IsString()
    @IsNotEmpty()
    product: ObjectId;

    @Field(() => ID, { nullable: false })
    @IsString()
    @IsNotEmpty()
    seller: ObjectId;

    @Field(() => [ReviewImageInput], { nullable: true })
    @IsArray()
    @IsOptional()
    @ValidateNested()
    @Type(() => ReviewImageInput)
    image: ReviewImageInput[];

    @Field(() => String, { nullable: false })
    @IsString()
    @IsNotEmpty()
    comment: string;

    @Field(() => Float, { nullable: false })
    @IsNumber()
    @IsNotEmpty()
    rate: number;
}