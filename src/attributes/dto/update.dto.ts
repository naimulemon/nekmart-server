import { InputType, Field } from "@nestjs/graphql";
import { IsString, IsNotEmpty, IsArray, ValidateNested, IsOptional } from "class-validator";
import { Type } from "class-transformer";

@InputType()
class UpdateValueInput {
    @Field(() => String, { nullable: true })
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    value: string;
    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    meta: string;
}

@InputType()
export class UpdateAttributeInput {
    @Field(() => String, { nullable: true })
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    name: string;

    @Field(() => [UpdateValueInput], { nullable: true })
    @IsArray()
    @IsNotEmpty()
    @IsOptional()
    @ValidateNested()
    @Type(() => UpdateValueInput)
    values: [UpdateValueInput];
}