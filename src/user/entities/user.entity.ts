import { ObjectType, Field, ID, Int, Float } from "@nestjs/graphql";
import { ObjectId } from "mongoose";

//Date-scalar
import { DateScalar } from "src/date.scalar";

@ObjectType()
export class Provider {
    @Field(() => String, { nullable: false })
    name: string;
    @Field(() => String, { nullable: false })
    id: string;
}

@ObjectType()
export class User {
    @Field(() => ID, { nullable: false })
    id: ObjectId;
    @Field(() => String, { nullable: true })
    name: string;
    @Field(() => String, { nullable: true })
    phone: string;
    @Field(() => String, { nullable: true })
    email: string;
    @Field(() => String, { nullable: true })
    avatar: string;
    @Field(() => Provider, { nullable: true })
    provider: Provider;
    @Field(() => Boolean, { nullable: false })
    verified: boolean;
    @Field(() => String, { nullable: false })
    role: string;
    @Field(() => Float, { nullable: true })
    points: number;
    @Field(() => Date, { nullable: false })
    createdAt: DateScalar;
    @Field(() => Date, { nullable: false })
    updatedAt: DateScalar;
}

@ObjectType()
export class PageInfos {
    @Field(() => Boolean, { nullable: false })
    hasNextPage: boolean;
    @Field(() => Int, { nullable: false })
    count: number;
}

@ObjectType()
export class GetUsers {
    @Field(() => Boolean, { nullable: false })
    success: boolean;
    @Field(() => [User], { nullable: false })
    users: [User];
    @Field(() => PageInfos, { nullable: false })
    pageInfos: PageInfos;
}