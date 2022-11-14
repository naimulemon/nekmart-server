import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type TagDocument = Tag & Document;

@Schema({ timestamps: true })
export class Tag {
    @Prop({ type: String, required: true })
    name: string;
    @Prop({ type: String, slug: "name", unique: true, slugPaddingSize: 1 })
    slug: string;
    @Prop({ type: String })
    description: string;
}

export const TagSchema = SchemaFactory.createForClass(Tag);