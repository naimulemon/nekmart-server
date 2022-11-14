import { InputType, Field, ID } from "@nestjs/graphql";
import { IsString, IsNotEmpty } from "class-validator";
import { ObjectId } from "mongoose";

@InputType()
export class ReplyInput {
    @Field(() => ID, { nullable: false })
    @IsString()
    @IsNotEmpty()
    reviewId: ObjectId;

    @Field(() => String, { nullable: false })
    @IsString()
    @IsNotEmpty()
    reply: string;
}
