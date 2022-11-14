import { InputType, Field } from "@nestjs/graphql";
import { IsString, IsNotEmpty } from "class-validator";

@InputType()
export class RunningInput {
    @Field(() => String, { nullable: false })
    @IsString()
    @IsNotEmpty()
    expires: string;
}