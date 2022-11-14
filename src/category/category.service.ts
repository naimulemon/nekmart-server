import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, ObjectId } from "mongoose";
import omitEmpty from "omit-empty";

//Schema
import { Category, CategoryDocument } from "./model/category.schema";
import { Subcategory, SubcategoryDocument } from "./model/sub-category.schema";
import { TreeCategory, TreeCategoryDocument } from "./model/tree-category.schema";

//Entities
import { SuccessInfo } from "src/user/entities/success.entity";

//Dto
import { CategoryInput } from "./dto/category.dto";
import { SubCategoryInput } from "./dto/sub-category.dto";
import { UpdateCateInput } from "./dto/update-category.dto";
import { UpdateSubInput } from "./dto/update-sub.dto";
import { TreeCategoryInput } from "./dto/tree-category.dto";
import { UpdateTreeInput } from "./dto/update-tree.dto";

@Injectable()
export class CategoryService {
    //Constructor
    constructor(
        @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
        @InjectModel(Subcategory.name) private subcategoryModel: Model<SubcategoryDocument>,
        @InjectModel(TreeCategory.name) private treeCategoryModel: Model<TreeCategoryDocument>
    ) { };

    //Get all category
    async categories() {
        const categories = await this.categoryModel.find();
        return categories;
    }

    //Get Single category
    async category(slug: string) {
        const category = await this.categoryModel.findOne({
            slug: slug
        });
        if (!category) throw new NotFoundException("Category not found!");
        return category;
    }

    //Get all subcategory service
    async subcategories() {
        const subcategories = await this.subcategoryModel.find();
        return subcategories;
    }

    //Get all subcategory service by category
    async subByCate(id: ObjectId) {
        const subCategories = await this.subcategoryModel.find({
            category: id
        })
        return subCategories;
    }

    //Get Single subcategory
    async subcategory(slug) {
        const subcategory = await this.subcategoryModel.findOne({
            slug: slug
        });
        if (!subcategory) throw new NotFoundException("Subcategory not found!");
        return subcategory;
    }

    //Get All tree category
    async getTree() {
        const treeCategory = await this.treeCategoryModel.find();
        return treeCategory;
    }

    //Get all tree category by sub category
    async getTreeBySub(id: ObjectId) {
        const treeCategory = await this.treeCategoryModel.find({
            subCategory: id
        });
        return treeCategory;
    }

    //Get single tree category
    async getSingleTree(slug: string) {
        const treeCategory = await this.treeCategoryModel.findOne({
            slug: slug
        });
        console.log(treeCategory);
        if (!treeCategory) throw new NotFoundException("Category not found!");
        return treeCategory;
    }

    //Add Category
    async createCate(categoryInput: CategoryInput): Promise<SuccessInfo> {
        categoryInput = await omitEmpty(categoryInput) as CategoryInput;
        const category = await this.categoryModel.findOne({
            name: categoryInput.name
        });
        if (category) throw new NotFoundException("Category already added!");
        await this.categoryModel.create(categoryInput);
        return {
            success: true,
            message: "Category added successfully!"
        }
    };

    //Add Sub-Category
    async createSub(subCateInput: SubCategoryInput): Promise<SuccessInfo> {
        subCateInput = await omitEmpty(subCateInput) as SubCategoryInput;
        const sub = await this.subcategoryModel.findOne({
            name: subCateInput.name,
            category: subCateInput.category
        });
        if (sub) throw new NotFoundException("Category already added!")
        const result = await this.subcategoryModel.create(subCateInput);
        await this.categoryModel.findByIdAndUpdate(subCateInput.category, {
            $push: {
                subCategory: result._id
            }
        }, { new: true })
        return {
            success: true,
            message: "Category added successfully!"
        }
    };

    //Add tree category
    async createTree(treeCategoryInput: TreeCategoryInput): Promise<SuccessInfo> {
        const tree = await this.treeCategoryModel.findOne({
            name: treeCategoryInput.name,
            subCategory: treeCategoryInput.subCategory
        });
        if (tree) throw new NotFoundException("Category already added!");
        const result = await this.treeCategoryModel.create(treeCategoryInput);
        await this.subcategoryModel.findByIdAndUpdate(treeCategoryInput.subCategory, {
            $push: {
                treeCategory: result._id
            }
        }, { new: true })
        return {
            success: true,
            message: "Category added to list successfully!"
        }
    }

    //Update category
    async updateCate(updateCateInput: UpdateCateInput, id: ObjectId): Promise<SuccessInfo> {
        updateCateInput = await omitEmpty(updateCateInput) as UpdateCateInput;
        const category = await this.categoryModel.findById(id);
        if (!category) throw new NotFoundException("Category not found!");
        if (category.name !== updateCateInput.name) {
            const hasCategory = await this.categoryModel.findOne({
                name: updateCateInput.name
            })
            if (hasCategory) throw new NotFoundException("Category name already in use!");
        }
        await this.categoryModel.findByIdAndUpdate(category._id, updateCateInput, { new: true });
        return {
            success: true,
            message: "Category updated successfully!"
        }
    };

    //Update sub category
    async updateSub(updateSubInput: UpdateSubInput, id: ObjectId): Promise<SuccessInfo> {
        updateSubInput = await omitEmpty(updateSubInput) as UpdateSubInput;
        const subcategory = await this.subcategoryModel.findById(id);
        if (!subcategory) throw new NotFoundException("Sub-category not found!");
        if (subcategory.name !== updateSubInput.name) {
            const hasSub = await this.subcategoryModel.findOne({
                name: updateSubInput.name
            });
            if (hasSub) throw new NotFoundException("Sub-category already in use!");
        }
        await this.subcategoryModel.findByIdAndUpdate(subcategory._id, updateSubInput, { new: true });
        if (updateSubInput.category) {
            await this.categoryModel.findByIdAndUpdate(subcategory.category, {
                $pull: {
                    subCategory: subcategory._id
                }
            })
            await this.categoryModel.findByIdAndUpdate(updateSubInput.category, {
                $push: {
                    subCategory: subcategory._id
                }
            })
        }
        return {
            success: true,
            message: "Sub-category updated successfully!"
        }
    };

    //Update tree category
    async updateTree(id: ObjectId, updateTreeInput: UpdateTreeInput): Promise<SuccessInfo> {
        updateTreeInput = await omitEmpty(updateTreeInput) as UpdateTreeInput;
        const treeCategory = await this.treeCategoryModel.findById(id);
        if (!treeCategory) throw new NotFoundException("Category not found!");
        if (treeCategory.name !== updateTreeInput.name) {
            const hasCategory = await this.treeCategoryModel.findOne({
                name: updateTreeInput.name
            });
            if (hasCategory) throw new NotFoundException("Category name already used!");
        }
        await this.treeCategoryModel.findByIdAndUpdate(treeCategory._id, updateTreeInput, { new: true });
        if (updateTreeInput.subCategory) {
            await this.subcategoryModel.findByIdAndUpdate(treeCategory.subCategory, {
                $pull: {
                    treeCategory: treeCategory._id
                }
            })
            await this.subcategoryModel.findByIdAndUpdate(updateTreeInput.subCategory, {
                $push: {
                    treeCategory: treeCategory._id
                }
            })
        }
        return {
            success: true,
            message: "Category updated successfully!"
        }
    }

    //Delete category
    async deleteCate(id: ObjectId): Promise<SuccessInfo> {
        const result = await this.categoryModel.findByIdAndDelete(id);
        if (!result) throw new NotFoundException("Category not found!");
        await this.subcategoryModel.deleteMany({
            category: id
        });
        return {
            success: true,
            message: "Category deleted successfully!"
        }
    }

    //Delete sub category
    async deleteSub(id: ObjectId): Promise<SuccessInfo> {
        const result = await this.subcategoryModel.findByIdAndDelete(id);
        if (!result) throw new NotFoundException("Sub category not found!");
        await this.categoryModel.findByIdAndUpdate(result.category, {
            $pull: {
                subCategory: id
            }
        });
        return {
            success: true,
            message: "Sub category deleted successfully!"
        }
    }

    //Delete tree category
    async deleteTree(id: ObjectId): Promise<SuccessInfo> {
        const result = await this.treeCategoryModel.findByIdAndDelete(id);
        if (!result) throw new NotFoundException("Category not found!");
        await this.subcategoryModel.findByIdAndUpdate(result.subCategory, {
            $pull: {
                treeCategory: id
            }
        });
        return {
            success: true,
            message: "Category deleted successfully!"
        }
    }

    //Get all category by batch service
    async findCategoryByBatch(Ids: ObjectId[]): Promise<(Category | Error)[]> {
        const categories = await this.categoryModel.find({ _id: { $in: Ids } });
        const mappedResults = Ids.map(
            (id) =>
                categories.find((result) => result.id === id.toString())
        );
        return mappedResults;
    }

    //Subcategory batch service
    async findSubCategoryByBatch(Ids: ObjectId[]): Promise<(Subcategory | Error)[]> {
        const categories = await this.subcategoryModel.find({ _id: { $in: Ids } });
        const mappedResults = Ids.map(
            (id) =>
                categories.find((result) => result.id === id.toString())
        );
        return mappedResults;
    }

    //Tree Category batch service
    async findTreeCategoryByBatch(Ids: ObjectId[]): Promise<(TreeCategory | Error)[]> {
        const categories = await this.treeCategoryModel.find({ _id: { $in: Ids } });
        const mappedResults = Ids.map(
            (id) =>
                categories.find((result) => result.id === id.toString())
        );
        return mappedResults;
    }
}