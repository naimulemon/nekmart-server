import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

//Service and Resolver
import { CategoryService } from "./category.service";
import { CategoryResolver, SubCategoryResolver, TreeCategoryResolver } from "./category.resolver";

//Schema
import { Category, CategorySchema } from "./model/category.schema";
import { Subcategory, SubcategorySchema } from "./model/sub-category.schema";
import { TreeCategory, TreeCategorySchema } from "./model/tree-category.schema";

//Module
import { UserModule } from "src/user/user.module";

@Module({
    imports: [
        MongooseModule.forFeature([{
            name: Category.name,
            schema: CategorySchema
        }, {
            name: Subcategory.name,
            schema: SubcategorySchema
        }, {
            name: TreeCategory.name,
            schema: TreeCategorySchema
        }]),
        UserModule
    ],
    providers: [CategoryService, CategoryResolver, SubCategoryResolver, TreeCategoryResolver],
    exports: [MongooseModule, CategoryService]
})
export class CategoryModule { }