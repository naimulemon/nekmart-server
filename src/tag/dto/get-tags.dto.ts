import { InputType, Field, Int } from "@nestjs/graphql";
import { IsString, IsOptional, IsNumber } from "class-validator";

@InputType()
export class TagPrams {
    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    search: string;

    @Field(() => Int, { nullable: true })
    @IsNumber()
    @IsOptional()
    limit: number;

    @Field(() => Int, { nullable: true })
    @IsNumber()
    @IsOptional()
    skip: number;
}