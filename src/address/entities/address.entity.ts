import { ObjectType, Field, HideField, ID } from "@nestjs/graphql";
import { ObjectId } from "mongoose";

//Date-scalar
import { DateScalar } from "src/date.scalar";

@ObjectType()
export class Address {
    @Field(() => ID, { nullable: false })
    id: ObjectId;
    @Field(() => String, { nullable: false })
    name: string;
    @Field(() => String, { nullable: false })
    phone: string;
    @Field(() => String, { nullable: true })
    gender: string;
    @Field(() => String, { nullable: false })
    address: string;
    @Field(() => String, { nullable: false })
    country: string;
    @Field(() => String, { nullable: false })
    city: string;
    @Field(() => String, { nullable: false })
    area: string;
    @Field(() => String, { nullable: false })
    postal: string;
    @Field(() => Boolean, { nullable: true })
    default: boolean;
    @HideField()
    user: ObjectId;
    @Field(() => Date, { nullable: false })
    createdAt: DateScalar;
    @Field(() => Date, { nullable: false })
    updatedAt: DateScalar;
}