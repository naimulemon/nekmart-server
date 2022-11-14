import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as Schemas } from "mongoose";

//Schema
import { User } from "src/user/model/user.schema";
import { Product } from "src/product/model/product.schema";
import { Seller } from "src/seller/model/seller.schema";

export type ReviewDocument = Review & Document;

@Schema({ _id: false })
class ReviewImage {
    @Prop({ type: String })
    url: string;
}

const ReviewImageSchema = SchemaFactory.createForClass(ReviewImage);

@Schema({ timestamps: true })
export class Review {
    @Prop({ type: Schemas.Types.ObjectId, ref: "User", required: true })
    user: User;
    @Prop({ type: Schemas.Types.ObjectId, ref: "Seller", required: true })
    seller: Seller;
    @Prop({ type: Schemas.Types.ObjectId, ref: "Product", required: true })
    product: Product;
    @Prop({ type: [ReviewImageSchema] })
    image: ReviewImage[];
    @Prop({ type: String, required: true })
    comment: string;
    @Prop({ type: String })
    reply: string;
    @Prop({ type: Number, required: true })
    rate: number;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);