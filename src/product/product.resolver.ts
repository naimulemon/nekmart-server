import { Resolver, ResolveField, Parent, Mutation, Query, Args, Context, ID } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { ObjectId } from "mongoose";

//Service
import { ProductService } from "./product.service";

//Entities
import { SuccessInfo } from "src/user/entities/success.entity";
import { GetProduct, Product } from "./entities/product.entity";
import { Seller } from "src/seller/entities/seller.entity";
import { Category } from "src/category/entities/category.entity";
import { Subcategory } from "src/category/entities/sub-category.entity";
import { TreeCategory } from "src/category/entities/tree-category.entity";
import { Brand } from "src/brand/entities/brand.entity";
import { Tag } from "src/tag/entities/tag.entity";
import { Flash } from "src/flash/entities/flash.entity";

//Dto
import { ProductInput } from "./dto/product.dto";
import { ProductUpdateInput } from "./dto/update.dto";
import { ProductPrams } from "./dto/get-product.dto";
import { UpdateFlashProductInput } from "./dto/update-flash-product.dto";

//Guard
import { Roles } from "src/auth/decorator/auth.decorator";
import { Role } from "src/auth/enum/auth.enum";
import { AuthGuard } from "src/auth/auth.guard";
import { RolesGuard } from "src/auth/roles.guard";

@Resolver(Product)
export class ProductResolver {
    //Constructor
    constructor(
        private readonly productService: ProductService
    ) { };

    //Get Products
    @Query(() => GetProduct, { name: "getProducts" })
    getProducts(
        @Args("productPrams") productPrams: ProductPrams
    ) {
        return this.productService.getProducts(productPrams);
    }

    //Get Single Product
    @Query(() => Product, { name: "getProduct" })
    getProduct(
        @Args("slug", { type: () => String }) slug: string
    ) {
        return this.productService.getProduct(slug)
    }

    //Get selling product
    @Query(() => [Product], { name: "getSellingProduct" })
    getSelling(
        @Args("slug", { type: () => String }) slug: string
    ) {
        return this.productService.getSelling(slug);
    }

    //Get Flash Product
    @Query(() => [Product], { name: "getFlashProduct" })
    getFlashProduct(
        @Args("flashSlug", { type: () => String }) flashSlug: string
    ) {
        return this.productService.getFlashProduct(flashSlug);
    }

    //Get no flash product
    @Query(() => [Product], { name: "getNoFlashProduct" })
    @Roles(Role.SELLER)
    @UseGuards(AuthGuard, RolesGuard)
    getNoFlashProduct(
        @Args("sellerId", { type: () => ID }) sellerId: ObjectId
    ) {
        return this.productService.getNoFlashProduct(sellerId);
    }

    //Get unapproved products
    @Query(() => [Product], { name: "getUnapprovedProduct" })
    @Roles(Role.EDITOR, Role.MODERATOR, Role.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    getUnapproved() {
        return this.productService.getUnapproved();
    }

    //Add Products
    @Mutation(() => SuccessInfo, { name: "addProduct" })
    @Roles(Role.SELLER)
    @UseGuards(AuthGuard, RolesGuard)
    add(
        @Args("productInput") productInput: ProductInput
    ) {
        return this.productService.add(productInput);
    }

    //Update Products
    @Mutation(() => SuccessInfo, { name: "updateProduct" })
    @Roles(Role.SELLER)
    @UseGuards(AuthGuard, RolesGuard)
    update(
        @Args("productUpdateInput") productUpdateInput: ProductUpdateInput,
        @Args("id", { type: () => ID }) id: ObjectId
    ) {
        return this.productService.update(id, productUpdateInput);
    }

    //Update products with flashes
    @Mutation(() => SuccessInfo, { name: "updateFlashProduct" })
    @Roles(Role.SELLER)
    @UseGuards(AuthGuard, RolesGuard)
    updateFlash(
        @Args("updateFlashProductInput") updateFlashProductInput: UpdateFlashProductInput
    ) {
        return this.productService.updateFlash(updateFlashProductInput);
    }

    //Change Product Visibility
    @Mutation(() => SuccessInfo, { name: "changeProductVisibility" })
    @Roles(Role.SELLER)
    @UseGuards(AuthGuard, RolesGuard)
    change(
        @Args("id", { type: () => ID }) id: ObjectId,
        @Args("visibility", { type: () => Boolean }) visibility: boolean
    ) {
        return this.productService.change(id, visibility);
    }

    //Approved products
    @Mutation(() => SuccessInfo, { name: "approvedProduct" })
    @Roles(Role.EDITOR, Role.MODERATOR, Role.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    approved(
        @Args("id", { type: () => ID }) id: ObjectId,
        @Args("approved", { type: () => Boolean }) approved: boolean
    ) {
        return this.productService.approved(id, approved)
    }

    //Delete Products
    @Mutation(() => SuccessInfo, { name: "deleteProduct" })
    @Roles(Role.SELLER)
    @UseGuards(AuthGuard, RolesGuard)
    delete(
        @Args("id", { type: () => ID }) id: ObjectId
    ) {
        return this.productService.delete(id);
    }

    //Resolve field for Seller in product query
    @ResolveField("seller", () => Seller, { nullable: true })
    getSeller(
        @Parent() product: Product,
        @Context() { loaders }: IGraphQLContext
    ) {
        return loaders.sellerLoader.load(product.seller);
    }

    //Resolve field for Category in Product Query
    @ResolveField("category", () => Category, { nullable: true })
    getCategory(
        @Parent() product: Product,
        @Context() { loaders }: IGraphQLContext
    ) {
        return loaders.categoryLoader.load(product.category);
    }

    //Resolve field for Subcategory in Product Query
    @ResolveField("subCategory", () => Subcategory, { nullable: true })
    getSubcategory(
        @Parent() product: Product,
        @Context() { loaders }: IGraphQLContext
    ) {
        return loaders.subCategoryLoader.load(product.subCategory);
    }

    //Resolve Field for Tree Category in Product query
    @ResolveField("treeCategory", () => [TreeCategory], { nullable: true })
    getTreeCategory(
        @Parent() product: Product,
        @Context() { loaders }: IGraphQLContext
    ) {
        return loaders.treeCategoryLoader.loadMany(product.treeCategory);
    }

    //Resolve Field for Brand in Product Query
    @ResolveField("brand", () => Brand, { nullable: true })
    getBrand(
        @Parent() product: Product,
        @Context() { loaders }: IGraphQLContext
    ) {
        if (product.brand) {
            return loaders.brandLoader.load(product.brand);
        } else return null;
    }

    //Resolve Field for Tag in Product Query
    @ResolveField("tag", () => [Tag], { nullable: true })
    getTag(
        @Parent() product: Product,
        @Context() { loaders }: IGraphQLContext
    ) {
        return loaders.tagLoader.loadMany(product.tag);
    }

    //Resolve Field for Tag in Product Query
    @ResolveField("flash", () => Flash, { nullable: true })
    getFlash(
        @Parent() product: Product,
        @Context() { loaders }: IGraphQLContext
    ) {
        if (product.flash) {
            return loaders.flashLoader.load(product.flash);
        } else return null;
    }
}