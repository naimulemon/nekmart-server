import { InputType, Field, Float } from "@nestjs/graphql";
import { IsString, IsNotEmpty, IsNumber } from "class-validator";

@InputType()
export class FlashInput {
    @Field(() => String, { nullable: false })
    @IsString()
    @IsNotEmpty()
    title: string;

    @Field(() => String, { nullable: false })
    @IsString()
    @IsNotEmpty()
    image: string;

    @Field(() => String, { nullable: false })
    @IsString()
    @IsNotEmpty()
    thumb: string;


    @Field(() => String, { nullable: false })
    @IsString()
    @IsNotEmpty()
    start: string;

    @Field(() => String, { nullable: false })
    @IsString()
    @IsNotEmpty()
    expires: string;

    @Field(() => Float, { nullable: false })
    @IsNumber()
    @IsNotEmpty()
    discount: number;

    @Field(() => String, { nullable: false })
    @IsString()
    @IsNotEmpty()
    discountUnit: string;
}