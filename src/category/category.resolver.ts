import { Resolver, ResolveField, Parent, Mutation, Query, Args, Context, ID } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { ObjectId } from "mongoose";

//Service
import { CategoryService } from "./category.service";

//Entity
import { SuccessInfo } from "src/user/entities/success.entity";
import { Category } from "./entities/category.entity";
import { Subcategory } from "./entities/sub-category.entity";
import { TreeCategory } from "./entities/tree-category.entity";

//Dto
import { CategoryInput } from "./dto/category.dto";
import { SubCategoryInput } from "./dto/sub-category.dto";
import { UpdateCateInput } from "./dto/update-category.dto";
import { UpdateSubInput } from "./dto/update-sub.dto";
import { TreeCategoryInput } from "./dto/tree-category.dto";
import { UpdateTreeInput } from "./dto/update-tree.dto";

//Guard
import { Roles } from "src/auth/decorator/auth.decorator";
import { Role } from "src/auth/enum/auth.enum";
import { AuthGuard } from "src/auth/auth.guard";
import { RolesGuard } from "src/auth/roles.guard";


//Resolver for category
@Resolver(() => Category)
export class CategoryResolver {
    //Constructor
    constructor(
        private readonly categoryService: CategoryService
    ) { }

    //Get All Category
    @Query(() => [Category], { name: "getCategories" })
    categories() {
        return this.categoryService.categories()
    }

    //Get Single Category
    @Query(() => Category, { name: "getCategory" })
    category(
        @Args("slug", { type: () => String }) slug: string
    ) {
        return this.categoryService.category(slug);
    }

    //Add Category
    @Mutation(() => SuccessInfo, { name: "addCategory" })
    @Roles(Role.MODERATOR, Role.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    addCate(
        @Args("categoryInput") categoryInput: CategoryInput
    ) {
        return this.categoryService.createCate(categoryInput);
    }

    //Update Category
    @Mutation(() => SuccessInfo, { name: "updateCategory" })
    @Roles(Role.MODERATOR, Role.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    updateCate(
        @Args("updateCateInput") updateCateInput: UpdateCateInput,
        @Args("id", { type: () => ID }) id: ObjectId
    ) {
        return this.categoryService.updateCate(updateCateInput, id)
    }

    //Delete Category
    @Mutation(() => SuccessInfo, { name: "deleteCategory" })
    @Roles(Role.MODERATOR, Role.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    deleteCate(
        @Args("id", { type: () => ID }) id: ObjectId
    ) {
        return this.categoryService.deleteCate(id)
    }

    //Resolver field for sub category query
    @ResolveField('subCategory', () => [Subcategory], { nullable: true })
    getSubCategory(
        @Parent() category: Category,
        @Context() { loaders }: IGraphQLContext
    ) {
        return loaders.subCategoryLoader.loadMany(category.subCategory)
    }
}

//Sub Category Resolver
@Resolver(() => Subcategory)
export class SubCategoryResolver {
    //Constructor
    constructor(
        private readonly categoryService: CategoryService
    ) { }

    //Get All subCategory
    @Query(() => [Subcategory], { name: "getSubCategories" })
    categories() {
        return this.categoryService.subcategories()
    }

    //Get All Sub Category by category
    @Query(() => [Subcategory], { name: "getSubCategoriesByCategory" })
    subByCate(
        @Args("id", { type: () => ID }) id: ObjectId
    ) {
        return this.categoryService.subByCate(id);
    }

    //Get Single SubCategory
    @Query(() => Subcategory, { name: "getSubCategory" })
    subcategory(
        @Args("slug", { type: () => String }) slug: string
    ) {
        return this.categoryService.subcategory(slug);
    }

    //Add SubCategory
    @Mutation(() => SuccessInfo, { name: "addSubCategory" })
    @Roles(Role.MODERATOR, Role.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    addCate(
        @Args("subCategoryInput") subCategoryInput: SubCategoryInput
    ) {
        return this.categoryService.createSub(subCategoryInput);
    }

    //Update Sub Category
    @Mutation(() => SuccessInfo, { name: "updateSubCategory" })
    @Roles(Role.MODERATOR, Role.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    updateSub(
        @Args("updateSubInput") updateSubInput: UpdateSubInput,
        @Args("id", { type: () => ID }) id: ObjectId
    ) {
        return this.categoryService.updateSub(updateSubInput, id);
    }

    //Delete Sub Category
    @Mutation(() => SuccessInfo, { name: "deleteSubCategory" })
    @Roles(Role.MODERATOR, Role.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    deleteSub(
        @Args("id", { type: () => ID }) id: ObjectId
    ) {
        return this.categoryService.deleteSub(id);
    }

    //Resolver field for category
    @ResolveField('category', () => Category, { nullable: true })
    getCategory(
        @Parent() subcategory: Subcategory,
        @Context() { loaders }: IGraphQLContext
    ) {
        return loaders.categoryLoader.load(subcategory.category);
    }

    //Resolve field for tree category
    @ResolveField("treeCategory", () => [TreeCategory], { nullable: true })
    getTreeCategory(
        @Parent() subcategory: Subcategory,
        @Context() { loaders }: IGraphQLContext
    ) {
        return loaders.treeCategoryLoader.loadMany(subcategory.treeCategory);
    }
}


//Resolver for Tree Category
@Resolver(TreeCategory)
export class TreeCategoryResolver {
    //Constructor
    constructor(
        private readonly categoryService: CategoryService
    ) { }

    //Get all tree category
    @Query(() => [TreeCategory], { name: "getTreeCategories" })
    get() {
        return this.categoryService.getTree();
    }

    //Get all tree category by subCategory
    @Query(() => [TreeCategory], { name: "getTreeCategoriesBySub" })
    getTreeBySub(
        @Args("id", { type: () => ID }) id: ObjectId
    ) {
        return this.categoryService.getTreeBySub(id);
    }

    //Get single tree category
    @Query(() => TreeCategory, { name: "getSingleTreeCategory" })
    getSingleTree(
        @Args("slug", { type: () => String }) slug: string
    ) {
        return this.categoryService.getSingleTree(slug);
    }

    //Create tree category
    @Mutation(() => SuccessInfo, { name: "createTreeCategory" })
    @Roles(Role.MODERATOR, Role.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    createTree(
        @Args("treeCategoryInput") treeCategoryInput: TreeCategoryInput
    ) {
        return this.categoryService.createTree(treeCategoryInput);
    }

    //Update tree category
    @Mutation(() => SuccessInfo, { name: "updateTreeCategory" })
    @Roles(Role.MODERATOR, Role.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    updateTree(
        @Args("id", { type: () => ID }) id: ObjectId,
        @Args("updateTreeInput") updateTreeInput: UpdateTreeInput
    ) {
        return this.categoryService.updateTree(id, updateTreeInput);
    }


    //Delete tree Category
    @Mutation(() => SuccessInfo, { name: "deleteTreeCategory" })
    @Roles(Role.MODERATOR, Role.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    deleteTree(
        @Args("id", { type: () => ID }) id: ObjectId
    ) {
        return this.categoryService.deleteTree(id)
    }

    //Resolve field for sub category
    @ResolveField("subCategory", () => Subcategory, { nullable: true })
    getSubs(
        @Parent() treeCategory: TreeCategory,
        @Context() { loaders }: IGraphQLContext
    ) {
        return loaders.subCategoryLoader.load(treeCategory.subCategory);
    }
}