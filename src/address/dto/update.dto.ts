import { InputType, Field } from "@nestjs/graphql";
import { IsString, IsOptional } from "class-validator";

@InputType()
export class UpdateAddressInput {
    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    name: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    phone: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    gender: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    address: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    country: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    city: string;

    @Field(() => String, { nullable: false })
    @IsString()
    @IsOptional()
    area: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    postal: string;
}