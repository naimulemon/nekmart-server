import { ObjectType, Field } from "@nestjs/graphql";

@ObjectType()
export class SignupInfo {
    @Field(() => Boolean, { nullable: false })
    success: true;
    @Field(() => String, { nullable: false })
    message: string;
    @Field(() => String, { nullable: false })
    phone: string
}