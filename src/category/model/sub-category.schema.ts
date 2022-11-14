import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as Schemas } from "mongoose";

//Category Schema
import { Category } from "./category.schema";
import { TreeCategory } from "./tree-category.schema";

export type SubcategoryDocument = Subcategory & Document;

@Schema({ timestamps: true })
export class Subcategory {
    @Prop({ type: String, required: true })
    name: string;
    @Prop({ type: String, slug: "name", unique: true, slugPaddingSize: 1 })
    slug: string;
    @Prop({ type: String })
    image: string;
    @Prop({ type: Schemas.Types.ObjectId, ref: "Category", required: true })
    category: Category;
    @Prop({ type: [{ type: Schemas.Types.ObjectId, ref: "TreeCategory" }] })
    treeCategory: TreeCategory[];
}

export const SubcategorySchema = SchemaFactory.createForClass(Subcategory);