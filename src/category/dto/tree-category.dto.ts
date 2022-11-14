import { InputType, Field, ID } from "@nestjs/graphql";
import { IsString, IsNotEmpty } from "class-validator";
import { ObjectId } from "mongoose";

@InputType()
export class TreeCategoryInput {
    @Field(() => String, { nullable: false })
    @IsString()
    @IsNotEmpty()
    name: string;

    @Field(() => ID, { nullable: false })
    @IsString()
    @IsNotEmpty()
    subCategory: ObjectId
}