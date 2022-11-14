import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type BannerDocument = Banner & Document;

@Schema({ timestamps: true })
export class Banner {
    @Prop({ type: String, required: true })
    name: string;
    @Prop({ type: String, required: true })
    url: string;
    @Prop({ type: String, required: true })
    banner: string;
}

export const BannerSchema = SchemaFactory.createForClass(Banner);