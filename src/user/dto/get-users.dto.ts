import { InputType, Field, Int } from "@nestjs/graphql";
import { IsString, IsNumber, IsOptional } from "class-validator";

@InputType()
export class UserPrams {
    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    search: string;

    @Field(() => Int, { nullable: true })
    @IsNumber()
    @IsOptional()
    skip: number;

    @Field(() => Int, { nullable: true })
    @IsNumber()
    @IsOptional()
    limit: number;
}