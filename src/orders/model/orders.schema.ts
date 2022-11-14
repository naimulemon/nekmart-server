import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as Schemas } from "mongoose";

//Schema
import { User } from "src/user/model/user.schema";
import { Seller } from "src/seller/model/seller.schema";
import { Address } from "src/address/model/address.schema";
import { Product } from "src/product/model/product.schema";

export type OrderDocument = Orders & Document;

@Schema({ _id: false })
class Products {
    @Prop({ type: Schemas.Types.ObjectId, ref: "Product" })
    productId: Product;
    @Prop({ type: Number })
    quantity: number;
    @Prop({ type: String })
    variation: string;
    @Prop({ type: Number })
    tax: number;
}

const ProductsSchema = SchemaFactory.createForClass(Products);

@Schema({ _id: false })
class ProductInfo {
    @Prop({ type: Schemas.Types.ObjectId, ref: "Seller" })
    seller: Seller;
    @Prop({ type: [ProductsSchema] })
    products: Products[];
    @Prop({ type: Number })
    price: number;
    @Prop({ type: String, required: true, enum: ["Pending", "Confirmed", "Picked up", "On the way", "Delivered", "Cancelled"], default: "Pending" })
    status: string;
    @Prop({ type: String })
    cancelBy: string;
}

const ProductInfoSchema = SchemaFactory.createForClass(ProductInfo);

@Schema({ _id: false })
class Payment {
    @Prop({ type: String })
    paymentType: string;
    @Prop({ type: String })
    paymentId: string;
    @Prop({ type: String })
    provider: string;
}
const PaymentSchema = SchemaFactory.createForClass(Payment);

@Schema({ timestamps: true })
export class Orders {
    @Prop({ type: String, required: true })
    orderId: string;
    @Prop({ type: Schemas.Types.ObjectId, ref: "User", required: true })
    user: User;
    @Prop({ type: Schemas.Types.ObjectId, ref: "Address", required: true })
    shippingAddress: Address;
    @Prop({ type: Schemas.Types.ObjectId, ref: "Address", required: true })
    billingAddress: Address;
    @Prop({ type: [ProductInfoSchema] })
    productInfo: ProductInfo[];
    @Prop({ type: Number, required: true })
    total: number;
    @Prop({ type: Number, required: true })
    shippingFees: number;
    @Prop({ type: Number })
    couponDiscount: number;
    @Prop({ type: Number })
    subtotal: number;
    @Prop({ type: PaymentSchema })
    paymentInfo: Payment;
    @Prop({ type: String, required: true })
    paymentMethod: string;
    @Prop({ type: String })
    note: string;
}

export const OrderSchema = SchemaFactory.createForClass(Orders);