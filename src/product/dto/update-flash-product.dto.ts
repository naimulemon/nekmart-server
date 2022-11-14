import { InputType, Field, ID } from "@nestjs/graphql";
import { IsString, IsNotEmpty, IsArray } from "class-validator";
import { ObjectId } from "mongoose";

@InputType()
export class UpdateFlashProductInput {
    @Field(() => ID, { nullable: false })
    @IsString()
    @IsNotEmpty()
    flashId: ObjectId;

    @Field(() => [ID], { nullable: false })
    @IsArray()
    @IsNotEmpty()
    productIds: ObjectId[];
}