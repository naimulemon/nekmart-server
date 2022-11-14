import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as Schemas } from "mongoose";

//Schema
import { User } from "src/user/model/user.schema";

export type CouponDocument = Coupon & Document;

@Schema({ timestamps: true })
export class Coupon {
    @Prop({ type: String, required: true })
    name: string;
    @Prop({ type: String, slug: "name", unique: true, slugPaddingSize: 1 })
    slug: string;
    @Prop({ type: String, required: true })
    code: string;
    @Prop({ type: Number })
    discount: number;
    @Prop({ type: String, enum: ["flat", "percent"] })
    discountUnit: string;
    @Prop({ type: Number })
    minimumPurchase: number;
    @Prop({ type: Date })
    expires: Date;
    @Prop({ type: Schemas.Types.ObjectId })
    user: User;
    @Prop({ type: Number })
    points: number;
}

export const CouponSchema = SchemaFactory.createForClass(Coupon);