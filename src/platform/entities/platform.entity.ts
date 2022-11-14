import { ObjectType, Field, Float } from "@nestjs/graphql";

@ObjectType()
export class Platform {
    @Field(() => Float, { nullable: false })
    charge: number;
}