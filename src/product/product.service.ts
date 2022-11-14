import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, ObjectId } from "mongoose";
import { Cron, CronExpression } from '@nestjs/schedule';
import omitEmpty from "omit-empty";

//Schema
import { Product, ProductDocument } from "./model/product.schema";
import { Seller, SellerDocument } from "src/seller/model/seller.schema";
import { Flash, FlashDocument } from "src/flash/model/flash.schema";
import { Category, CategoryDocument } from "src/category/model/category.schema";
import { Subcategory, SubcategoryDocument } from "src/category/model/sub-category.schema";
import { TreeCategory, TreeCategoryDocument } from "src/category/model/tree-category.schema";
import { Brand, BrandDocument } from "src/brand/model/brand.schema";

//Entities
import { SuccessInfo } from "src/user/entities/success.entity";

//Dto
import { ProductInput } from "./dto/product.dto";
import { ProductUpdateInput } from "./dto/update.dto";
import { ProductPrams } from "./dto/get-product.dto";
import { UpdateFlashProductInput } from "./dto/update-flash-product.dto";

@Injectable()
export class ProductService {
    //Constructor
    constructor(
        @InjectModel(Product.name) private productModel: Model<ProductDocument>,
        @InjectModel(Seller.name) private sellerModel: Model<SellerDocument>,
        @InjectModel(Flash.name) private flashModel: Model<FlashDocument>,
        @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
        @InjectModel(Subcategory.name) private subcategoryModel: Model<SubcategoryDocument>,
        @InjectModel(TreeCategory.name) private treeCategoryModel: Model<TreeCategoryDocument>,
        @InjectModel(Brand.name) private brandModel: Model<BrandDocument>
    ) { };

    //Cron Job form Delete expired Flash, and Update It's product
    @Cron(CronExpression.EVERY_HOUR)
    async handleCron() {
        const flashes = await this.flashModel.find({
            expires: {
                $lt: Date.now()
            }
        });
        flashes.length > 0 && flashes.map(async (flash) => {
            const products = await this.productModel.find({
                flash: flash._id
            });
            products.length > 0 && products.map(async (product) => {
                let totalPrice: number;
                if (product.taxUnit === "percent") {
                    totalPrice = Math.round(product.price + (product.price * (product.tax / 100)))
                } else if (product.taxUnit === "flat") {
                    totalPrice = Math.round(product.price + product.tax);
                }
                await this.productModel.findByIdAndUpdate(product._id, {
                    flash: null,
                    discount: 0,
                    totalPrice
                }, { new: true });
            });
            await this.flashModel.findByIdAndDelete(flash._id)
        })
    }
    //Get Products
    async getProducts(productPrams: ProductPrams) {
        const order = productPrams?.order === "aesc" ? 1 : -1;
        const sortBy = productPrams?.sortBy ? productPrams.sortBy : '_id';
        const skip = productPrams.limit * (parseFloat(productPrams.skip) - 1);
        const seller = await this.sellerModel.findOne({
            slug: productPrams?.seller
        })
        const category = await this.categoryModel.findOne({
            slug: productPrams?.category
        });
        const brand = await this.brandModel.findOne({
            slug: productPrams?.brand
        });
        const subcategory = await this.subcategoryModel.find({
            slug: productPrams?.subCategory
        });
        const treeCategory = await this.treeCategoryModel.find({
            slug: productPrams?.treeCategory
        })
        let args = {};
        for (let key in productPrams) {
            if (productPrams[key].length > 0) {
                if (key === "search") {
                    args["name"] = {
                        $regex: new RegExp(productPrams['search'].replace(/[-[\]{}()*+?.,\\/^$|#\s]/g, "\\$&")),
                        $options: 'i'
                    }
                }
                if (key === "seller") {
                    args["seller"] = seller?._id
                }
                if (key === "category") {
                    args["category"] = category?._id
                }
                if (key === "subCategory") {
                    args["subCategory"] = {
                        $in: subcategory?.map((item) => item?._id)
                    }
                }
                if (key === "treeCategory") {
                    args["treeCategory"] = {
                        $in: treeCategory?.map((item) => item?.id)
                    }
                }
                if (key === "brand") {
                    args["brand"] = brand?._id
                }
                if (productPrams["visibility"]) {
                    args["visibility"] = productPrams["visibility"]
                }
                if (productPrams["approved"]) {
                    args["approved"] = productPrams["approved"]
                }
                if (key === "price") {
                    args['totalPrice'] = {
                        $gte: productPrams['price'][0],
                        $lte: productPrams['price'][1],
                    }
                }
            }
        }
        const count = await this.productModel.countDocuments(args);
        const minPrice = await this.productModel.find({
            $or: [{
                category: category?._id,
                approved: true
            }, {
                name: {
                    $regex: new RegExp(productPrams?.search?.replace(/[-[\]{}()*+?.,\\/^$|#\s]/g, "\\$&")),
                    $options: 'i'
                }
            }]
        }).sort({ totalPrice: 1 }).limit(1);
        const maxPrice = await this.productModel.find({
            $or: [{
                category: category?._id,
                approved: true
            }, {
                name: {
                    $regex: new RegExp(productPrams?.search?.replace(/[-[\]{}()*+?.,\\/^$|#\s]/g, "\\$&")),
                    $options: 'i'
                }
            }]
        }).sort({ totalPrice: -1 }).limit(1);
        let products = await this.productModel.find(args)
            .sort({ [sortBy]: order })
            .limit(productPrams.limit + 1)
            .skip(skip)
        const hasNextPage = products.length > productPrams.limit;
        products = hasNextPage ? products.slice(0, -1) : products;
        return {
            success: true,
            products,
            pageInfos: {
                hasNextPage,
                count
            },
            priceRange: {
                highest: maxPrice[0]?.totalPrice,
                lowest: minPrice[0]?.totalPrice
            }
        }
    }

    //Get Product
    async getProduct(slug: string) {
        const product = await this.productModel.findOne({
            slug: slug
        });
        if (!product) throw new NotFoundException("Product not found!");
        return product;
    }

    //Get Selling product
    async getSelling(slug: string) {
        const product = await this.productModel.findOne({
            slug: slug
        });
        if (!product) throw new NotFoundException("Product not found!");
        const products = await this.productModel.find({
            category: product.category,
            _id: {
                $ne: product._id
            }
        }).limit(10)
        return products;
    }

    //Get Flash Product
    async getFlashProduct(flashSlug: string) {
        const flash = await this.flashModel.findOne({
            slug: flashSlug
        })
        const product = await this.productModel.find({
            flash: flash._id
        });
        return product;
    }

    //Get No Flash Product
    async getNoFlashProduct(sellerId: ObjectId) {
        const product = await this.productModel.find({
            flash: null,
            seller: sellerId
        });
        return product;
    }

    //Get Unapproved products
    async getUnapproved() {
        const product = await this.productModel.find({
            approved: false,
            visibility: true
        })
        return product;
    }

    //Add Products
    async add(productInput: ProductInput): Promise<SuccessInfo> {
        const deletedInput = await omitEmpty(productInput) as ProductInput;
        const seller = await this.sellerModel.findById(deletedInput.seller);
        if (seller.banned || seller.hidden) throw new NotFoundException("You are restricted!");
        let totalPrice: number;
        if (deletedInput.discountUnit === "percent") {
            totalPrice = Math.round(deletedInput.price - (deletedInput.price * (deletedInput.discount / 100)));
        } else if (deletedInput.discountUnit === "flat") {
            totalPrice = Math.round(deletedInput.price - deletedInput.discount);
        }
        await this.productModel.create({ ...deletedInput, totalPrice });
        return {
            success: true,
            message: "Product added successfully!"
        }
    }

    //Update Products
    async update(id: ObjectId, productUpdateInput: ProductUpdateInput): Promise<SuccessInfo> {
        const deletedInput = await omitEmpty(productUpdateInput) as ProductUpdateInput;
        let totalPrice: number;
        if (deletedInput?.discountUnit === "percent") {
            totalPrice = Math.round(deletedInput.price - (deletedInput.price * (deletedInput.discount / 100)));
        } else if (deletedInput.discountUnit === "flat") {
            totalPrice = Math.round(deletedInput.price - deletedInput.discount);
        }
        const result = await this.productModel.findByIdAndUpdate(id, { ...deletedInput, totalPrice }, { new: true });
        if (!result) throw new NotFoundException("Product not found!");
        return {
            success: true,
            message: "Product updated successfully!"
        }
    }

    //Update flash products
    async updateFlash(updateFlashProductInput: UpdateFlashProductInput): Promise<SuccessInfo> {
        const flash = await this.flashModel.findById(updateFlashProductInput.flashId);
        const productIds = updateFlashProductInput.productIds
        for (let key in productIds) {
            const product = await this.productModel.findById(productIds[key]);
            let totalPrice: number;
            if (flash.discountUnit === "percent") {
                totalPrice = Math.round(product.price - (product.price * (flash.discount / 100)));
            } else if (flash.discountUnit === "flat") {
                totalPrice = Math.round(product.price - flash.discount);
            }
            await this.productModel.findByIdAndUpdate(product._id, {
                discount: flash.discount,
                discountUnit: flash.discountUnit,
                totalPrice,
                flash: flash._id
            })
        }
        return {
            success: true,
            message: "Flash product updated successfully!"
        }
    }

    //Change Product Visibility
    async change(id: ObjectId, visibility: boolean): Promise<SuccessInfo> {
        const result = await this.productModel.findByIdAndUpdate(id, { visibility }, { new: true });
        if (!result) throw new NotFoundException("Product not found!");
        return {
            success: true,
            message: "Product visibility change successfully!"
        }
    }

    //Approved products
    async approved(id: ObjectId, approved: boolean): Promise<SuccessInfo> {
        const result = await this.productModel.findByIdAndUpdate(id, { approved }, {
            new: true
        })
        if (!result) throw new NotFoundException("Product not found!");
        return {
            success: true,
            message: "Product approved successfully!"
        }
    }

    //Delete Product
    async delete(id: ObjectId): Promise<SuccessInfo> {
        const result = await this.productModel.findByIdAndDelete(id);
        if (!result) throw new NotFoundException("Product not found!");
        return {
            success: true,
            message: "Product deleted successfully!"
        }
    }

    //Get product by batch
    async findProductByBatch(Ids: ObjectId[]): Promise<(Product | Error)[]> {
        const products = await this.productModel.find({ _id: { $in: Ids } });
        const mappedResults = Ids.map(
            (id) =>
                products.find((result) => result.id === id.toString())
        );
        return mappedResults;
    }
}