import { ObjectType, Field, ID } from "@nestjs/graphql";
import { ObjectId } from "mongoose";

//Date-Scalar
import { DateScalar } from "src/date.scalar";

@ObjectType()
export class Values {
    @Field(() => String, { nullable: false })
    value: string;
    @Field(() => String, { nullable: true })
    meta: string;
}

@ObjectType()
export class Attribute {
    @Field(() => ID, { nullable: false })
    id: ObjectId;
    @Field(() => String, { nullable: false })
    name: string;
    @Field(() => String, { nullable: false })
    slug: string;
    @Field(() => [Values])
    values: [Values]
    @Field(() => Date, { nullable: false })
    createdAt: DateScalar;
    @Field(() => Date, { nullable: false })
    updatedAt: DateScalar;
}