import { ObjectType, Field, ID } from "@nestjs/graphql";
import { ObjectId } from "mongoose";

//Date-scalar
import { DateScalar } from "src/date.scalar";

@ObjectType()
class PreorderUrl {
    @Field(() => String, { nullable: true })
    url: string
}
@ObjectType()
export class Preorder {
    @Field(() => ID, { nullable: false })
    id: ObjectId;
    @Field(() => String, { nullable: false })
    firstName: string;
    @Field(() => String, { nullable: false })
    lastName: string;
    @Field(() => String, { nullable: false })
    phone: string;
    @Field(() => String, { nullable: false })
    address: string;
    @Field(() => String, { nullable: true })
    email: string;
    @Field(() => [PreorderUrl], { nullable: true })
    productImage: PreorderUrl[];
    @Field(() => [PreorderUrl], { nullable: true })
    productUrl: PreorderUrl[];
    @Field(() => Date, { nullable: false })
    createdAt: DateScalar;
    @Field(() => Date, { nullable: false })
    updatedAt: DateScalar;
}