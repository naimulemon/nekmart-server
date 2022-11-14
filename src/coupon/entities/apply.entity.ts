import { ObjectType, Field, Float } from "@nestjs/graphql";

@ObjectType()
export class ApplyInfo {
    @Field(() => Boolean, { nullable: false })
    success: boolean;
    @Field(() => String, { nullable: false })
    message: string;
    @Field(() => Float, { nullable: false })
    discount: number;
    @Field(() => String, { nullable: false })
    discountUnit: string;
}