import { ObjectType, Field, ID } from "@nestjs/graphql";
import { ObjectId } from "mongoose";

//Date-scalar
import { DateScalar } from "src/date.scalar";

//PageInfos
import { PageInfos } from "src/user/entities/user.entity";

@ObjectType()
export class Brand {
    @Field(() => ID, { nullable: false })
    id: ObjectId;
    @Field(() => String, { nullable: false })
    name: string;
    @Field(() => String, { nullable: false })
    slug: string;
    @Field(() => String, { nullable: true })
    description: string;
    @Field(() => String, { nullable: true })
    image: string;
    @Field(() => Date, { nullable: false })
    createdAt: DateScalar;
    @Field(() => Date, { nullable: false })
    updatedAt: DateScalar;
}

@ObjectType()
export class GetBrands {
    @Field(() => Boolean, { nullable: false })
    success: boolean;
    @Field(() => [Brand], { nullable: false })
    brands: [Brand];
    @Field(() => PageInfos, { nullable: false })
    pageInfos: PageInfos;
}