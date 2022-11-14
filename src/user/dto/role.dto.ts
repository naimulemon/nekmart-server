import { InputType, Field, ID } from "@nestjs/graphql";
import { IsString, IsNotEmpty } from "class-validator";
import { ObjectId } from "mongoose";

@InputType()
export class RoleInput {
    @Field(() => ID, { nullable: false })
    @IsString()
    @IsNotEmpty()
    id: ObjectId;

    @Field(() => String, { nullable: false })
    @IsString()
    @IsNotEmpty()
    role: string;
}