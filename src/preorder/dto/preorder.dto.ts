import { InputType, Field } from "@nestjs/graphql";
import { IsString, IsNotEmpty, IsOptional, IsArray, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

@InputType()
class PreorderUrlInput {
    @Field(() => String, { nullable: true })
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    url: string;
}

@InputType()
export class PreorderInput {
    @Field(() => String, { nullable: false })
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @Field(() => String, { nullable: false })
    @IsString()
    @IsNotEmpty()
    lastName: string;

    @Field(() => String, { nullable: false })
    @IsString()
    @IsNotEmpty()
    phone: string;

    @Field(() => String, { nullable: false })
    @IsString()
    @IsNotEmpty()
    address: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    email: string;

    @Field(() => [PreorderUrlInput], { nullable: true })
    @IsArray()
    @IsOptional()
    @ValidateNested()
    @Type(() => PreorderUrlInput)
    productImage: PreorderUrlInput[];

    @Field(() => [PreorderUrlInput], { nullable: true })
    @IsArray()
    @IsOptional()
    @ValidateNested()
    @Type(() => PreorderUrlInput)
    productUrl: PreorderUrlInput[];
}