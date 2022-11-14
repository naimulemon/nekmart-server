import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as Schemas } from "mongoose";

//Sub category
import { Subcategory } from "./sub-category.schema";

export type TreeCategoryDocument = Document & TreeCategory;

@Schema({ timestamps: true })
export class TreeCategory {
    @Prop({ type: String, required: true })
    name: string;
    @Prop({ type: String, slug: "name", unique: true, slugPaddingSize: 1 })
    slug: string;
    @Prop({ type: Schemas.Types.ObjectId, ref: "Subcategory", required: true })
    subCategory: Subcategory;
}

export const TreeCategorySchema = SchemaFactory.createForClass(TreeCategory);