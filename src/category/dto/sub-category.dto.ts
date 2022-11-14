import { InputType, Field, ID } from "@nestjs/graphql";
import { IsString, IsNotEmpty, IsOptional } from "class-validator";
import { ObjectId } from "mongoose";

@InputType()
export class SubCategoryInput {
    @Field(() => String, { nullable: false })
    @IsString()
    @IsNotEmpty()
    name: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    image: string;

    @Field(() => ID, { nullable: false })
    @IsString()
    @IsNotEmpty()
    category: ObjectId;
}