import { ObjectType, Field } from "@nestjs/graphql";

//Date Scalar
import { DateScalar } from "src/date.scalar";

@ObjectType()
export class RegisterInfo {
    @Field(() => Boolean, { nullable: false })
    success: boolean;
    @Field(() => String, { nullable: false })
    message: string;
    @Field(() => String, { nullable: false })
    token: string;
    @Field(() => Date, { nullable: false })
    expire: DateScalar;
}