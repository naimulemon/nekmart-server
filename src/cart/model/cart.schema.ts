import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as Schemas } from "mongoose";

//Schema
import { Seller } from "src/seller/model/seller.schema";
import { Product } from "src/product/model/product.schema";
import { User } from "src/user/model/user.schema";

export type CartDocument = Cart & Document;

@Schema({ timestamps: true })
export class Cart {
    @Prop({ type: Schemas.Types.ObjectId, required: true, ref: "Product" })
    product: Product;
    @Prop({ type: Schemas.Types.ObjectId, ref: "User", required: true })
    user: User;
    @Prop({ type: Schemas.Types.ObjectId, required: true, ref: "Seller" })
    seller: Seller;
    @Prop({ type: Number, required: true, min: 1 })
    quantity: number;
    @Prop({ type: Number })
    minPurchase: number;
    @Prop({ type: Number, required: true })
    amount: number;
    @Prop({ type: String })
    variation: string;
}

export const CartSchema = SchemaFactory.createForClass(Cart);