import { ObjectType, Field, HideField, Float, ID } from "@nestjs/graphql";
import { ObjectId } from "mongoose";

//Date Scalar
import { DateScalar } from "src/date.scalar";


import { PageInfos } from "src/user/entities/user.entity";

@ObjectType()
export class BankInformation {
    @Field(() => String, { nullable: true })
    name: string;
    @Field(() => String, { nullable: true })
    accNumber: string;
    @Field(() => String, { nullable: true })
    routing: string;
    @Field(() => String, { nullable: true })
    bankName: string;
    @Field(() => String, { nullable: true })
    branch: string;
}

@ObjectType()
export class Seller {
    @Field(() => ID, { nullable: false })
    id: ObjectId;
    @HideField()
    user: ObjectId;
    @Field(() => String, { nullable: false })
    shopName: string;
    @Field(() => String, { nullable: false })
    phone: string;
    @Field(() => String, { nullable: false })
    slug: string;
    @Field(() => String, { nullable: true })
    logo: string;
    @Field(() => String, { nullable: true })
    banner: string;
    @Field(() => String, { nullable: true })
    address: string;
    @Field(() => String, { nullable: true })
    metaTitle: string;
    @Field(() => String, { nullable: true })
    metaDescription: string;
    @Field(() => Boolean, { nullable: true })
    verified: boolean;
    @Field(() => Boolean, { nullable: true })
    banned: boolean;
    @Field(() => Float, { nullable: true })
    reviews: number;
    @Field(() => Float, { nullable: true })
    totalRatting: number;
    @Field(() => BankInformation, { nullable: true })
    bankInformation: BankInformation;
    @Field(() => Date, { nullable: false })
    createdAt: DateScalar;
    @Field(() => Date, { nullable: false })
    updatedAt: DateScalar;
}

@ObjectType()
export class GetSeller {
    @Field(() => Boolean, { nullable: true })
    success: boolean;
    @Field(() => [Seller], { nullable: true })
    sellers: Seller[];
    @Field(() => PageInfos, { nullable: true })
    pageInfos: PageInfos;
}