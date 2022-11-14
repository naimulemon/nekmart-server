import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type FlashDocument = Flash & Document;

@Schema({ timestamps: true })
export class Flash {
    @Prop({ type: String, required: true })
    title: string;
    @Prop({ type: String, slug: "title", unique: true, slugPaddingSize: 1 })
    slug: string;
    @Prop({ type: String, required: true })
    image: string;
    @Prop({ type: String, required: true })
    thumb: string;
    @Prop({ type: Date, required: true })
    start: Date;
    @Prop({ type: Date, required: true })
    expires: Date;
    @Prop({ type: Number, required: true })
    discount: number;
    @Prop({ type: String, required: true })
    discountUnit: string;
}

export const FlashSchema = SchemaFactory.createForClass(Flash);