import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type ShippingDocument = Shipping & Document;

@Schema({ timestamps: true })
export class Shipping {
    @Prop({ type: String, required: true })
    name: string;
    @Prop({ type: String, slug: "name", unique: true, slugPaddingSize: 1 })
    slug: string;
    @Prop({ type: Number, required: true })
    rateInsideDhaka: number;
    @Prop({ type: Number, required: true })
    rateOutsideDhaka: number;
    @Prop({ type: Number, required: true })
    rateInSavar: number;
    @Prop({ type: String, required: true })
    estimateDelivery: string;
    @Prop({ type: String })
    description: string;
}

export const ShippingSchema = SchemaFactory.createForClass(Shipping);