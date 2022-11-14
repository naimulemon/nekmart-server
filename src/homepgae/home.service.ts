import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, ObjectId } from "mongoose";

//Date scalar
import { DateScalar } from "src/date.scalar";

//Schema
import { BannerDocument, Banner } from "./model/banner.schema";
import { SliderDocument, Slider } from "./model/slider.schema";
import { SectionDocument, Section } from "./model/section.schema";
import { ProductDocument, Product } from "src/product/model/product.schema";

//Entities
import { SuccessInfo } from "src/user/entities/success.entity";
import { Sections } from "./entities/section.entity";
import { Product as Products } from "src/product/entities/product.entity";

//Dto
import { BannerInput } from "./dto/banner.dto";
import { SliderInput } from "./dto/slider.dto";
import { SectionInput } from "./dto/section.dto";


//Type
interface ProductsType extends Products {
    createdAt: DateScalar;
    updatedAt: DateScalar;
}

@Injectable()
export class HomeService {
    //Constructor
    constructor(
        @InjectModel(Banner.name) private bannerModel: Model<BannerDocument>,
        @InjectModel(Section.name) private sectionModel: Model<SectionDocument>,
        @InjectModel(Product.name) private productModel: Model<ProductDocument>,
        @InjectModel(Slider.name) private sliderModel: Model<SliderDocument>
    ) { };

    //////Banner part
    //Get banner
    async getBanners() {
        const banners = await this.bannerModel.find();
        return banners;
    }
    //Add banner
    async addBanner(bannerInput: BannerInput): Promise<SuccessInfo> {
        const count = await this.bannerModel.countDocuments();
        if (count >= 10) throw new NotFoundException("You can add 10 banner only!");
        await this.bannerModel.create(bannerInput);
        return {
            success: true,
            message: "Banner added successfully!"
        }
    }
    //Delete banner
    async deleteBanner(id: ObjectId): Promise<SuccessInfo> {
        const result = await this.bannerModel.findByIdAndDelete(id);
        if (!result) throw new NotFoundException("Banner id not found!");
        return {
            success: true,
            message: "Banner deleted successfully!"
        }
    }

    /////Slider part
    //Get slider
    async getSlider() {
        const sliders = await this.sliderModel.find();
        return sliders;
    }

    //Add slider
    async addSlider(sliderInput: SliderInput): Promise<SuccessInfo> {
        const count = await this.sliderModel.countDocuments();
        if (count >= 10) throw new NotFoundException("You can add 10 banner only!");
        await this.sliderModel.create(sliderInput);
        return {
            success: true,
            message: "Slider added successfully!"
        }
    }

    //Delete slider
    async deleteSlider(id: ObjectId): Promise<SuccessInfo> {
        const result = await this.sliderModel.findByIdAndDelete(id);
        if (!result) throw new NotFoundException("Slider id not found!");
        return {
            success: true,
            message: "Slider deleted successfully!"
        }
    }

    //////Section part
    //Get sections
    async getSections() {
        let sections: Sections[] = await this.sectionModel.find({
            publish: true
        });
        for (let i = 0; i < sections.length; i++) {
            if (sections[i].base === "category") {
                const product = await this.productModel.find({
                    category: sections[i].category
                }).limit(12);
                sections[i].products = product as unknown as ProductsType[]
            } else if (sections[i].base === "latest") {
                const latestProduct = await this.productModel.find().sort({ _id: -1 }).limit(12)
                sections[i].products = latestProduct as unknown as ProductsType[]
            }
        }
        return sections
    }
    //Get single sections
    async getSingle(id: ObjectId) {
        const sections: Sections = await this.sectionModel.findById(id);
        if (!sections) throw new NotFoundException("Section id not found!");
        return sections
    }

    //Add section
    async addSection(sectionInput: SectionInput): Promise<SuccessInfo> {
        const count = await this.sectionModel.countDocuments();
        if (count >= 6) throw new NotFoundException("You can add 4 section only!");
        await this.sectionModel.create(sectionInput);
        return {
            success: true,
            message: "Section added successfully!"
        }
    }

    //Update section
    async updateSection(sectionInput: SectionInput, id: ObjectId): Promise<SuccessInfo> {
        const result = await this.sectionModel.findByIdAndUpdate(id, sectionInput, { new: true });
        if (!result) throw new NotFoundException("Section id not found!");
        return {
            success: true,
            message: "Section updated successfully!"
        }
    }
}