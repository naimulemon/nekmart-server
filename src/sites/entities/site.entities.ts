import { ObjectType, Field, ID } from "@nestjs/graphql";
import { ObjectId } from "mongoose";

//Data-scalar
import { DateScalar } from "src/date.scalar";


@ObjectType()
class Seo {
    @Field(() => String, { nullable: true })
    metaTitle: string;
    @Field(() => String, { nullable: true })
    metaDescription: string;
    @Field(() => [String], { nullable: true })
    metaTag: string[];
    @Field(() => String, { nullable: true })
    siteUrl: string;
    @Field(() => String, { nullable: true })
    ogTitle: string;
    @Field(() => String, { nullable: true })
    ogDescription: string;
    @Field(() => String, { nullable: true })
    ogImage: string;
}

@ObjectType()
class Additional {
    @Field(() => String, { nullable: true })
    email: string;
    @Field(() => String, { nullable: true })
    phone: string;
    @Field(() => String, { nullable: true })
    corporateOffice: string;
    @Field(() => String, { nullable: true })
    headOffice: string;
}

@ObjectType()
class Social {
    @Field(() => String, { nullable: true })
    facebook: string;
    @Field(() => String, { nullable: true })
    instagram: string;
    @Field(() => String, { nullable: true })
    youtube: string;
    @Field(() => String, { nullable: true })
    twitter: string;
    @Field(() => String, { nullable: true })
    linkedIn: string;
}

@ObjectType()
export class Site {
    @Field(() => ID, { nullable: true })
    id: ObjectId;
    @Field(() => String, { nullable: true })
    logo: string;
    @Field(() => String, { nullable: true })
    icon: string;
    @Field(() => String, { nullable: true })
    siteTitle: string;
    @Field(() => String, { nullable: true })
    slogan: string;
    @Field(() => Seo, { nullable: true })
    seo: Seo;
    @Field(() => Additional, { nullable: true })
    additionInfo: Additional;
    @Field(() => Social, { nullable: true })
    social: Social;
    @Field(() => Date, { nullable: true })
    createdAt: DateScalar;
    @Field(() => Date, { nullable: true })
    updatedAt: DateScalar;
}