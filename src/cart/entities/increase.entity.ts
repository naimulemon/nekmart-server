import { ObjectType, Field } from "@nestjs/graphql";

@ObjectType()
export class IncreaseInfo {
    @Field(() => Boolean, { nullable: false })
    success: boolean;
    @Field(() => Boolean, { nullable: false })
    hasMore: boolean;
    @Field(() => String, { nullable: false })
    message: string;
}