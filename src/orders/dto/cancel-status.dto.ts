import { InputType, Field, ID } from "@nestjs/graphql";
import { IsString, IsNotEmpty } from "class-validator";
import { ObjectId } from "mongoose";

@InputType()
export class CancelStatusInput {
    @Field(() => ID, { nullable: false })
    @IsString()
    @IsNotEmpty()
    id: ObjectId;

    @Field(() => ID, { nullable: false })
    @IsString()
    @IsNotEmpty()
    ownId: ObjectId;
}