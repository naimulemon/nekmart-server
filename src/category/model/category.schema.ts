import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as Schemas } from "mongoose";

//Sub category schema
import { Subcategory } from "./sub-category.schema";

export type CategoryDocument = Category & Document;

@Schema({ timestamps: true })
export class Category {
    @Prop({ type: String, required: true })
    name: string;
    @Prop({ type: String, slug: "name", unique: true, slugPaddingSize: 1 })
    slug: string;
    @Prop({ type: String })
    image: string;
    @Prop({ type: String })
    description: string;
    @Prop({ type: [{ type: Schemas.Types.ObjectId, ref: "Subcategory" }] })
    subCategory: Subcategory[];
}

export const CategorySchema = SchemaFactory.createForClass(Category);