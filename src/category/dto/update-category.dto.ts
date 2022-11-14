import { InputType, Field } from "@nestjs/graphql";
import { IsString, IsOptional } from "class-validator";

@InputType()
export class UpdateCateInput {
    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    name: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    image: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    description: string;
}