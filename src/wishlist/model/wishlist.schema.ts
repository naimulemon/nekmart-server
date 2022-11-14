import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as Schemas } from "mongoose";

//Schema
import { User } from "src/user/model/user.schema";
import { Product } from "src/product/model/product.schema";


export type WishlistDocument = Wishlist & Document;

@Schema({ timestamps: true })
export class Wishlist {
    @Prop({ type: Schemas.Types.ObjectId, required: true })
    user: User;
    @Prop({ type: Schemas.Types.ObjectId, required: true })
    product: Product;
}

export const WishlistSchema = SchemaFactory.createForClass(Wishlist);