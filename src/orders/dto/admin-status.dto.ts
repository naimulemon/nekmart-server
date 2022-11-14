import { InputType, Field, ID } from "@nestjs/graphql";
import { IsString, IsNotEmpty, IsEnum } from "class-validator";
import { ObjectId } from "mongoose";

@InputType()
export class AdminStatusInput {
    @Field(() => ID, { nullable: false })
    @IsString()
    @IsNotEmpty()
    id: ObjectId;

    @Field(() => String, { nullable: false })
    @IsString()
    @IsNotEmpty()
    @IsEnum(["Pending", "Confirmed", "Picked up", "On the way", "Delivered"], { message: "Status can be only 'Pending', 'Confirmed', 'Picked up', 'On the way', 'Delivered'!" })
    status: string;

    @Field(() => ID, { nullable: false })
    @IsString()
    @IsNotEmpty()
    sellerId: ObjectId;
}