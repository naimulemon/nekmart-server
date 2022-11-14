import { ObjectType, HideField, Field, ID } from "@nestjs/graphql";
import { ObjectId } from "mongoose";

//Products
import { Product } from "src/product/entities/product.entity";

//Date-scalar
import { DateScalar } from "src/date.scalar";

@ObjectType()
export class Sections {
    @Field(() => ID, { nullable: false })
    id: ObjectId;
    @Field(() => String, { nullable: false })
    name: string;
    @Field(() => String, { nullable: false })
    description: string;
    @Field(() => Boolean, { nullable: false })
    publish: boolean;
    @Field(() => String, { nullable: false })
    base: string;
    @HideField()
    category: ObjectId;
    @Field(() => [Product], { nullable: true })
    products: Product[];
    @Field(() => Date, { nullable: false })
    createdAt: DateScalar;
    @Field(() => Date, { nullable: false })
    updatedAt: DateScalar;
}