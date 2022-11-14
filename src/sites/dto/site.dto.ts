import { InputType, Field } from "@nestjs/graphql";
import { IsString, IsOptional, IsObject, ValidateNested, IsArray } from "class-validator";
import { Type } from "class-transformer";

@InputType()
class SeoInput {
    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    metaTitle: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    metaDescription: string;

    @Field(() => [String], { nullable: true })
    @IsArray()
    @IsOptional()
    metaTag: string[];

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    siteUrl: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    ogTitle: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    ogDescription: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    ogImage: string;
}

@InputType()
class AdditionalInput {
    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    email: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    phone: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    corporateOffice: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    headOffice: string;
}

@InputType()
class SocialInput {
    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    facebook: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    instagram: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    youtube: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    twitter: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    linkedIn: string;
}

@InputType()
export class SiteInput {
    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    logo: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    icon: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    siteTitle: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    slogan: string;

    @Field(() => SeoInput, { nullable: true })
    @IsObject()
    @IsOptional()
    @ValidateNested()
    @Type(() => SeoInput)
    seo: SeoInput;

    @Field(() => AdditionalInput, { nullable: true })
    @IsObject()
    @IsOptional()
    @ValidateNested()
    @Type(() => AdditionalInput)
    additionInfo: AdditionalInput;

    @Field(() => SocialInput, { nullable: true })
    @IsObject()
    @IsOptional()
    @ValidateNested()
    @Type(() => SocialInput)
    social: SocialInput;
}