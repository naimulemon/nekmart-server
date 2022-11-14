import { ObjectType, Field, ID, Float } from "@nestjs/graphql";
import { ObjectId } from "mongoose";

//Date-scalar
import { DateScalar } from "src/date.scalar";

@ObjectType()
export class Flash {
    @Field(() => ID, { nullable: false })
    id: ObjectId;
    @Field(() => String, { nullable: false })
    title: string;
    @Field(() => String, { nullable: false })
    slug: string;
    @Field(() => String, { nullable: false })
    image: string;
    @Field(() => String, { nullable: false })
    thumb: string;
    @Field(() => Date, { nullable: false })
    start: DateScalar;
    @Field(() => Date, { nullable: false })
    expires: DateScalar;
    @Field(() => Float, { nullable: false })
    discount: number
    @Field(() => String, { nullable: false })
    discountUnit: string;
    @Field(() => Date, { nullable: false })
    createdAt: DateScalar;
    @Field(() => Date, { nullable: false })
    updatedAt: DateScalar;
}