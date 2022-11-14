import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as Schemas } from "mongoose";

//Schemas
import { Seller } from "./seller.schema";
import { User } from "src/user/model/user.schema";
import { Product } from "src/product/model/product.schema";
import { Orders } from "src/orders/model/orders.schema";
import { Address } from "src/address/model/address.schema";

export type IncomeDocument = Income & Document;


@Schema({ _id: false })
class Products {
    @Prop({ type: Schemas.Types.ObjectId, ref: "Product", required: true })
    productId: Product;
    @Prop({ type: Number, required: true })
    quantity: string;
}

const ProductsSchema = SchemaFactory.createForClass(Products);

@Schema({ timestamps: true })
export class Income {
    @Prop({ type: Schemas.Types.ObjectId, required: true, ref: "Seller" })
    seller: Seller;
    @Prop({ type: Schemas.Types.ObjectId, required: true, ref: "User" })
    user: User;
    @Prop({ type: Schemas.Types.ObjectId, required: true, ref: "Address" })
    address: Address;
    @Prop({ type: Schemas.Types.ObjectId, required: true, ref: "Order" })
    orderId: Orders;
    @Prop({ type: [ProductsSchema] })
    products: Products[];
    @Prop({ type: Number, required: true })
    income: number;
    @Prop({ type: Boolean, default: false })
    paySuccess: boolean;
    @Prop({ type: String, enum: ["Pending", "Approved", "Cancelled"] })
    refunded: boolean;
}

export const IncomeSchema = SchemaFactory.createForClass(Income);