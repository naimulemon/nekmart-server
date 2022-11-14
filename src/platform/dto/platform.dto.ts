import { InputType, Field, Float } from "@nestjs/graphql";

@InputType()
export class PlatformInput {
    @Field(() => Float, { nullable: false })
    charge: number;
}