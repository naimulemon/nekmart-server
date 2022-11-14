import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, ObjectId } from "mongoose";
import omitEmpty from "omit-empty";

//Schema
import { Brand, BrandDocument } from "./model/brand.schema";

//Dto
import { BrandInput } from "./dto/brand.dto";
import { UpdateBrandInput } from "./dto/update.dto";
import { BrandParams } from "./dto/get-brand.dto";

//Entities
import { SuccessInfo } from "src/user/entities/success.entity";

@Injectable()
export class BrandService {
    //Constructor
    constructor(
        @InjectModel(Brand.name) private brandModel: Model<BrandDocument>
    ) { };

    //Get Brands
    async getBrands(brandPrams: BrandParams) {
        let brands = await this.brandModel.find({
            name: {
                '$regex': brandPrams.search ? brandPrams.search : "",
                '$options': 'i'
            }
        }).sort({ _id: -1 }).limit(brandPrams.limit + 1).skip(brandPrams.skip);
        const count = await this.brandModel.countDocuments({
            name: {
                '$regex': brandPrams.search ? brandPrams.search : "",
                '$options': 'i'
            }
        });
        const hasNextPage = brands.length > brandPrams.limit;
        brands = hasNextPage ? brands.slice(0, -1) : brands;
        return {
            success: true,
            brands,
            pageInfos: {
                hasNextPage,
                count
            }
        }
    }

    //Get Single Brands
    async getBrand(slug: string) {
        const brand = await this.brandModel.findOne({
            slug: slug
        });
        if (!brand) throw new NotFoundException("Brand not found!");
        return brand;
    }

    //Add Brand
    async add(brandInput: BrandInput): Promise<SuccessInfo> {
        brandInput = await omitEmpty(brandInput) as BrandInput;
        const brand = await this.brandModel.findOne({
            name: brandInput.name
        });
        if (brand) throw new NotFoundException("Brand is already created!");
        await this.brandModel.create(brandInput);
        return {
            success: true,
            message: "Brand created successfully!"
        }
    }

    //Update Brand
    async update(id: ObjectId, updateBrandInput: UpdateBrandInput): Promise<SuccessInfo> {
        updateBrandInput = await omitEmpty(updateBrandInput) as UpdateBrandInput;
        const brand = await this.brandModel.findById(id);
        if (!brand) throw new NotFoundException("Brand not found!");
        if (brand.name !== updateBrandInput.name) {
            const hasBrand = await this.brandModel.findOne({
                name: updateBrandInput.name
            });
            if (hasBrand) throw new NotFoundException("Brand is already listed");
        }
        await this.brandModel.findByIdAndUpdate(brand._id, updateBrandInput, { new: true });
        return {
            success: true,
            message: "Brand updated successfully!"
        }
    }

    //Delete Brand
    async delete(id: ObjectId): Promise<SuccessInfo> {
        const result = await this.brandModel.findByIdAndDelete(id);
        if (!result) throw new NotFoundException("Brand not found!");
        return {
            success: true,
            message: "Brand deleted successfully!"
        }
    }

    //Get Brand by batch loader
    async findBrandByBatch(Ids: ObjectId[]): Promise<(Brand | Error)[]> {
        const brands = await this.brandModel.find({ _id: { $in: Ids } });
        const mappedResults = Ids.map(
            (id) =>
                brands.find((result) => result.id === id.toString())
        );
        return mappedResults;
    }
}