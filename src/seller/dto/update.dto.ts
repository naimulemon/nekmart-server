import { InputType, Field } from "@nestjs/graphql";
import { IsString, IsOptional } from "class-validator";

@InputType()
export class UpdateSellerInput {
    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    shopName: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
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