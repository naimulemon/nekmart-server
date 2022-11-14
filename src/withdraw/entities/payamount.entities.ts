import { ObjectType, Field, Float } from "@nestjs/graphql";

//Incomes
import { Income } from "src/seller/entities/income.entities";

@ObjectType()
export class IncomePayment {
    @Field(() => Float, { nullable: false })
    amount: number;
    @Field(() => [Income], { nullable: true })
    incomes: Income[]
}