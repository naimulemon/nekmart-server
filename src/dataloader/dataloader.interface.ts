import DataLoader from 'dataloader';
import { ObjectId } from "mongoose";

//Schema Types
import { Category } from "src/category/model/category.schema";
import { Subcategory } from "src/category/model/sub-category.schema";
import { TreeCategory } from "src/category/model/tree-category.schema";
import { User } from "src/user/model/user.schema";
import { Brand } from "src/brand/model/brand.schema";
import { Tag } from "src/tag/model/tag.schema";
import { Product } from "src/product/model/product.schema";
import { Address } from "src/address/model/address.schema";
import { Shipping } from "src/shipping/model/shipping.schema";
import { Orders } from "src/orders/model/orders.schema";
import { Flash } from "src/flash/model/flash.schema";
import { Seller } from "src/seller/model/seller.schema";

export interface IDataloaders {
    categoryLoader: DataLoader<ObjectId, Category>;
    subCategoryLoader: DataLoader<ObjectId, Subcategory>;
    treeCategoryLoader: DataLoader<ObjectId, TreeCategory>;
    userLoader: DataLoader<ObjectId, User>;
    brandLoader: DataLoader<ObjectId, Brand>;
    tagLoader: DataLoader<ObjectId, Tag>;
    productLoader: DataLoader<ObjectId, Product>;
    addressLoader: DataLoader<ObjectId, Address>;
    shippingLoader: DataLoader<ObjectId, Shipping>;
    ordersLoader: DataLoader<ObjectId, Orders>;
    flashLoader: DataLoader<ObjectId, Flash>;
    sellerLoader: DataLoader<ObjectId, Seller>;
}