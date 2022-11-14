import { InputType, Field } from "@nestjs/graphql";
import { IsString, IsNotEmpty, IsOptional } from "class-validator";

@InputType()
export class SellerInput {
    @Field(() => String, { nullable: false })
    @IsString()
    @IsNotEmpty()
    shopName: string;

    @Field(() => String, { nullable: false })
    @IsString()
    @IsNotEmpty()
    phone: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    logo: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    banner: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    address: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    metaTitle: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    metaDescription: string;
}