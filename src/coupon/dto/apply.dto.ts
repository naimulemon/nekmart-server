import { InputType, Field, Float } from "@nestjs/graphql";
import { IsString, IsNotEmpty, IsNumber } from "class-validator";

@InputType()
export class ApplyInput {
    @Field(() => String, { nullable: false })
    @IsString()
    @IsNotEmpty()
    code: string;

    @Field(() => Float, { nullable: true })
    @IsNumber()
    @IsNotEmpty()
    minPurchase: number;
}