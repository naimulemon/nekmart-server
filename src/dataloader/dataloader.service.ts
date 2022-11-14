import { Injectable } from "@nestjs/common";
import DataLoader from "dataloader";
import { ObjectId } from "mongoose";

//Dataloader Interface
import { IDataloaders } from './dataloader.interface';

//Services
import { CategoryService } from "src/category/category.service";
import { UserService } from "src/user/user.service";
import { BrandService } from "src/brand/brand.service";
import { TagService } from "src/tag/tag.service";
import { ProductService } from "src/product/product.service";
import { AddressService } from "src/address/address.service";
import { ShippingService } from "src/shipping/shipping.service";
import { OrderService } from "src/orders/orders.service";
import { FlashService } from "src/flash/flash.service";
import { SellerService } from "src/seller/seller.service";

//Schema
//-----Category Schema
import { Category } from "src/category/model/category.schema";
import { Subcategory } from "src/category/model/sub-category.schema";
import { TreeCategory } from "src/category/model/tree-category.schema";
//-----Address Schema
import { User } from "src/user/model/user.schema";
//----Brand Schema
import { Brand } from "src/brand/model/brand.schema";
//----Tag Schema
import { Tag } from "src/tag/model/tag.schema";
//----Product Schema
import { Product } from "src/product/model/product.schema";
//----Address Schema
import { Address } from "src/address/model/address.schema";
//----Shipping Schema
import { Shipping } from "src/shipping/model/shipping.schema";
//----Order Schema
import { Orders } from "src/orders/model/orders.schema";
//----Flash Schema
import { Flash } from "src/flash/model/flash.schema";
//---Seller Schema
import { Seller } from "src/seller/model/seller.schema";

@Injectable()
export class DataloaderService {
    constructor(
        private readonly categoryService: CategoryService,
        private readonly userService: UserService,
        private readonly brandService: BrandService,
        private readonly tagService: TagService,
        private readonly productService: ProductService,
        private readonly addressService: AddressService,
        private readonly shippingService: ShippingService,
        private readonly orderService: OrderService,
        private readonly flashService: FlashService,
        private readonly sellerService: SellerService
    ) { };

    createLoaders(): IDataloaders {
        const categoryLoader = new DataLoader<ObjectId, Category>(
            async (keys: readonly ObjectId[]) =>
                this.categoryService.findCategoryByBatch(keys as ObjectId[])
        );
        const subCategoryLoader = new DataLoader<ObjectId, Subcategory>(
            async (keys: readonly ObjectId[]) =>
                this.categoryService.findSubCategoryByBatch(keys as ObjectId[])
        );
        const treeCategoryLoader = new DataLoader<ObjectId, TreeCategory>(
            async (keys: readonly ObjectId[]) =>
                this.categoryService.findTreeCategoryByBatch(keys as ObjectId[])
        );
        const userLoader = new DataLoader<ObjectId, User>(
            async (keys: readonly ObjectId[]) =>
                this.userService.findUserByBatch(keys as ObjectId[])
        )
        const brandLoader = new DataLoader<ObjectId, Brand>(
            async (keys: readonly ObjectId[]) =>
                this.brandService.findBrandByBatch(keys as ObjectId[])
        )
        const tagLoader = new DataLoader<ObjectId, Tag>(
            async (keys: readonly ObjectId[]) =>
                this.tagService.findTagByBatch(keys as ObjectId[])
        )
        const productLoader = new DataLoader<ObjectId, Product>(
            async (keys: readonly ObjectId[]) =>
                this.productService.findProductByBatch(keys as ObjectId[])
        )
        const addressLoader = new DataLoader<ObjectId, Address>(
            async (keys: readonly ObjectId[]) =>
                this.addressService.findAddressByBatch(keys as ObjectId[])
        )
        const shippingLoader = new DataLoader<ObjectId, Shipping>(
            async (keys: readonly ObjectId[]) =>
                this.shippingService.findShippingByBatch(keys as ObjectId[])
        )
        const ordersLoader = new DataLoader<ObjectId, Orders>(
            async (keys: readonly ObjectId[]) =>
                this.orderService.findOrderByBatch(keys as ObjectId[])
        )
        const flashLoader = new DataLoader<ObjectId, Flash>(
            async (keys: readonly ObjectId[]) =>
                this.flashService.findFlashByBatch(keys as ObjectId[])
        )
        const sellerLoader = new DataLoader<ObjectId, Seller>(
            async (keys: readonly ObjectId[]) =>
                this.sellerService.findSellerByBatch(keys as ObjectId[])
        )
        return {
            categoryLoader,
            subCategoryLoader,
            treeCategoryLoader,
            userLoader,
            brandLoader,
            tagLoader,
            productLoader,
            addressLoader,
            shippingLoader,
            ordersLoader,
            flashLoader,
            sellerLoader
        };
    }
}