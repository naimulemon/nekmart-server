import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

//Service and Resolver
import { HomeService } from "./home.service";
import { HomeResolver } from "./home.resolver";

//Schema
import { Banner, BannerSchema } from "./model/banner.schema";
import { Section, SectionSchema } from "./model/section.schema";
import { Slider, SliderSchema } from "./model/slider.schema";

//Module
import { UserModule } from "src/user/user.module";
import { ProductModule } from "src/product/product.module";

@Module({
    imports: [
        MongooseModule.forFeature([{
            name: Banner.name,
            schema: BannerSchema
        }, {
            name: Section.name,
            schema: SectionSchema
        }, {
            name: Slider.name,
            schema: SliderSchema
        }]),
        UserModule,
        ProductModule
    ],
    providers: [HomeService, HomeResolver]
})
export class HomeModule { }