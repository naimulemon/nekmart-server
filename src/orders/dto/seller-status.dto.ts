import { InputType, Field, ID } from "@nestjs/graphql";
import { IsString, IsNotEmpty, IsEnum } from "class-validator";
import { ObjectId } from "mongoose";

@InputType()
export class SellerStatusInput {
    @Field(() => String, { nullable: false })
    @IsString()
    @IsNotEmpty()
    @IsEnum(["Confirmed"], { message: "Status can be only 'Confirmed'!" })
    status: string;

    @Field(() => ID, { nullable: false })
    @IsString()
    @IsNotEmpty()
    ownId: ObjectId;
}