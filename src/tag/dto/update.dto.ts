import { InputType, Field } from "@nestjs/graphql";
import { IsString, IsOptional } from "class-validator";

@InputType()
export class UpdateTagInput {
    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    name: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    description: string;
}