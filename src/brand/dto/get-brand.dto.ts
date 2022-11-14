import { InputType, Field, Int } from "@nestjs/graphql";
import { IsString, IsNumber, IsOptional } from "class-validator";

@InputType()
export class BrandParams {
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