import { ObjectType, Field, HideField, Float, ID } from "@nestjs/graphql";
import { ObjectId } from "mongoose";

//Date-scalar
import { DateScalar } from "src/date.scalar";

@ObjectType()
export class PointsHistory {
    @Field(() => ID, { nullable: false })
    id: ObjectId;
    @Field(() => Float, { nullable: false })
    points: number;
    @HideField()
    order: ObjectId;
    @Field(() => Date, { nullable: false })
    createdAt: DateScalar;
    @Field(() => Date, { nullable: false })
    updatedAt: DateScalar;
}

@ObjectType()
export class Points {
    @Field(() => Float, { nullable: false })
    totalPoints: number;
    @Field(() => [PointsHistory], { nullable: false })
    history: PointsHistory[];
}