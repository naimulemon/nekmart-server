import { InputType, Field, ID } from "@nestjs/graphql";
import { IsString, IsOptional } from "class-validator";
import { ObjectId } from "mongoose";

@InputType()
export class UpdateSubInput {
    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    name: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    image: string;

    @Field(() => ID, { nullable: true })
    @IsString()
    @IsOptional()
    category: ObjectId;
}