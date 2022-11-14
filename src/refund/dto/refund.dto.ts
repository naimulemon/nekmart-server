import { InputType, Field, ID } from "@nestjs/graphql";
import { IsString, IsNotEmpty } from "class-validator";
import { ObjectId } from "mongoose";

@InputType()
export class RefundInput {
    @Field(() => ID, { nullable: false })
    @IsString()
    @IsNotEmpty()
    incomeId: ObjectId;

    @Field(() => String, { nullable: false })
    @IsString()
    @IsNotEmpty()
    reason: string;

    @Field(() => String, { nullable: false })
    @IsString()
    @IsNotEmpty()
    description: string;
}