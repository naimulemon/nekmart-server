import { InputType, Field, ID } from "@nestjs/graphql";
import { IsString, IsOptional, IsBoolean } from "class-validator";
import { ObjectId } from "mongoose";

@InputType()
export class SectionInput {
    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    name: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    description: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    base: string;

    @Field(() => ID, { nullable: true })
    @IsString()
    @IsOptional()
    category: ObjectId;

    @Field(() => Boolean, { nullable: true })
    @IsBoolean()
    @IsOptional()
    publish: boolean;
}