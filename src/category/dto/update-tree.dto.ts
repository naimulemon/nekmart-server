import { InputType, Field, ID } from "@nestjs/graphql";
import { IsString, IsOptional } from "class-validator";
import { ObjectId } from "mongoose";

@InputType()
export class UpdateTreeInput {
    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    name: string;

    @Field(() => ID, { nullable: true })
    @IsString()
    @IsOptional()
    subCategory: ObjectId
}