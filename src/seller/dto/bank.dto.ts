import { InputType, Field } from "@nestjs/graphql";
import { IsOptional, IsString } from "class-validator";

@InputType()
export class BankInformationInput {
    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    name: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    accNumber: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    routing: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    bankName: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    branch: string;
}