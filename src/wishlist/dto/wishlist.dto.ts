import { InputType, Field, ID } from "@nestjs/graphql";
import { IsString, IsNotEmpty } from "class-validator";
import { ObjectId } from "mongoose";

@InputType()
export class WishlistInput {
    @Field(() => ID, { nullable: false })
    @IsString()
    @IsNotEmpty()
    productId: ObjectId;
}
