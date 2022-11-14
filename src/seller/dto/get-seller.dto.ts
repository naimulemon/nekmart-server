import { InputType, Field } from "@nestjs/graphql";
import { IsString, IsOptional } from "class-validator";

@InputType()
export class SellerPrams {
    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    search: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    limit: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    skip: string;
}