import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as Schemas } from "mongoose";

//All Schemas
import { Seller } from "src/seller/model/seller.schema";
import { Category } from "src/category/model/category.schema";
import { Subcategory } from "src/category/model/sub-category.schema";
import { TreeCategory } from "src/category/model/tree-category.schema";
import { Brand } from "src/brand/model/brand.schema";
import { Tag } from "src/tag/model/tag.schema";
import { Flash } from "src/flash/model/flash.schema";

export type ProductDocument = Product & Document;

@Schema({ _id: false })
class Images {
    @Prop({ type: String })
    url: string;
}

const ImageSchema = SchemaFactory.createForClass(Images);

@Schema({ _id: false })
class Attributes {
    @Prop({ type: String })
    variant: string;
    @Prop({ type: Number })
    price: number;
    @Prop({ type: Number })
    quantity: number;
    @Prop({ type: String })
    image: string;
}

const AttributeSchema = SchemaFactory.createForClass(Attributes);

@Schema({ _id: false })
class Specification {
    @Prop({ type: String })
    title: string;
    @Prop({ type: String })
    value: string;
}

const SpecificationSchema = SchemaFactory.createForClass(Specification);

@Schema({ _id: false })
class Meta {
    @Prop({ type: String })
    title: string;
    @Prop({ type: String })
    description: string;
    @Prop({ type: [String] })
    metaTags: string[];
    @Prop({ type: String })
    image: string;
}

const MetaSchema = SchemaFactory.createForClass(Meta);

@Schema({ timestamps: true })
export class Product {
    @Prop({ type: String, required: true })
    name: string;
    @Prop({ type: String, slug: "name", unique: true, slugPaddingSize: 1 })
    slug: string;
    @Prop({ type: Schemas.Types.ObjectId, ref: "Seller", required: true })
    seller: Seller;
    @Prop({ type: Schemas.Types.ObjectId, ref: "Category", required: true })
    category: Category;
    @Prop({ type: Schemas.Types.ObjectId, ref: "Subcategory" })
    subCategory: Subcategory;
    @Prop({ type: [{ type: Schemas.Types.ObjectId, ref: "TreeCategory" }] })
    treeCategory: TreeCategory[];
    @Prop({ type: Schemas.Types.ObjectId, ref: "Brand" })
    brand: Brand;
    @Prop({ type: String })
    unit: string;
    @Prop({ type: Number })
    minPurchase: number;
    @Prop({ type: [{ type: Schemas.Types.ObjectId, ref: "Tag" }] })
    tag: Tag[];
    @Prop({ type: Boolean })
    refundAble: boolean;
    @Prop({ type: Boolean })
    digitalProduct: boolean;
    @Prop({ type: String })
    productFile: string;
    @Prop({ type: [ImageSchema] })
    productImages: Images[];
    @Prop({ type: String })
    youtubeLink: string;
    @Prop({ type: Number })
    price: number;
    @Prop({ type: Schemas.Types.ObjectId, ref: "Flash" })
    flash: Flash;
    @Prop({ type: Number })
    discount: number;
    @Prop({ type: String, enum: ["flat", "percent"] })
    discountUnit: string;
    @Prop({ type: Number })
    quantity: number;
    @Prop({ type: String })
    description: string;
    @Prop({ type: [AttributeSchema] })
    attributes: Attributes[];
    @Prop({ type: [SpecificationSchema] })
    specification: Specification[];
    @Prop({ type: Boolean })
    visibility: boolean;
    @Prop({ type: Boolean, default: false })
    approved: boolean;
    @Prop({ type: MetaSchema })
    meta: Meta;
    @Prop({ type: String })
    shippingDays: string;
    @Prop({ type: Boolean })
    showStock: boolean;
    @Prop({ type: Number })
    tax: number;
    @Prop({ type: String, enum: ["flat", "percent"] })
    taxUnit: string;
    @Prop({ type: Number })
    totalPrice: number;
    @Prop({ type: String })
    disclaimer: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

