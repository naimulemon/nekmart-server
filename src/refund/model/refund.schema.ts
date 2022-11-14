import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as Schemas } from "mongoose";

//Schema
import { User } from "src/user/model/user.schema";
import { Product } from "src/product/model/product.schema";
import { Orders } from "src/orders/model/orders.schema";
import { Address } from "src/address/model/address.schema";
import { Seller } from "src/seller/model/seller.schema";
import { Income } from "src/seller/model/income.schema";

export type RefundDocument = Refund & Document;


@Schema({ _id: false })
class RefundProduct {
    @Prop({ type: Schemas.Types.ObjectId, required: true, ref: "Product" })
    productId: Product;
    @Prop({ type: Number, required: true })
    quantity: number;
}

const RefundProductSchema = SchemaFactory.createForClass(RefundProduct);

@Schema({ timestamps: true })
export class Refund {
    @Prop({ type: Schemas.Types.ObjectId, required: true, ref: "Income" })
    incomeId: Income;
    @Prop({ type: Schemas.Types.ObjectId, required: true, ref: "Order" })
    orderId: Orders;
    @Prop({ type: Schemas.Types.ObjectId, required: true, ref: "User" })
    user: User;
    @Prop({ type: [RefundProductSchema] })
    products: RefundProduct[];
    @Prop({ type: Schemas.Types.ObjectId, required: true, ref: "Seller" })
    seller: Seller;
    @Prop({ type: Schemas.Types.ObjectId, required: true })
    address: Address;
    @Prop({ type: String, required: true })
    reason: string;
    @Prop({ type: String, required: true })
    description: string;
    @Prop({ type: String, enum: ["Approved", "Pending", "Cancelled"], default: "Pending" })
    status: string;
}

export const RefundSchema = SchemaFactory.createForClass(Refund);