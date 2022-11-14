import { Resolver, ResolveField, Parent, Mutation, Query, Args, Context, ID } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { ObjectId } from "mongoose";

//Service
import { HomeService } from "./home.service";

//Entities
import { SuccessInfo } from "src/user/entities/success.entity";
import { Banner } from "./entities/banner.entity";
import { Sections } from "./entities/section.entity";
import { Category } from "src/category/entities/category.entity";
import { Slider } from "./entities/slider.entity";

//Dto
import { BannerInput } from "./dto/banner.dto";
import { SectionInput } from "./dto/section.dto";
import { SliderInput } from "./dto/slider.dto";

//Guard
import { Roles } from "src/auth/decorator/auth.decorator";
import { Role } from "src/auth/enum/auth.enum";
import { AuthGuard } from "src/auth/auth.guard";
import { RolesGuard } from "src/auth/roles.guard";

@Resolver(Sections)
export class HomeResolver {
    //Constructor
    constructor(
        private readonly homeService: HomeService
    ) { };
    ///////Banner Part
    //Get Banners
    @Query(() => [Banner], { name: "getBanners" })
    getBanner() {
        return this.homeService.getBanners();
    }
    //Add Banner
    @Mutation(() => SuccessInfo, { name: "addBanner" })
    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    addBanner(
        @Args("bannerInput") bannerInput: BannerInput
    ) {
        return this.homeService.addBanner(bannerInput);
    }

    //Delete Banner
    @Mutation(() => SuccessInfo, { name: "deleteBanner" })
    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    deleteBanner(
        @Args("id", { type: () => ID }) id: ObjectId
    ) {
        return this.homeService.deleteBanner(id);
    }

    ///////Slider part
    //Get Slider
    @Query(() => [Slider], { name: "getSliders" })
    getSlider() {
        return this.homeService.getSlider();
    }
    //Add Slider
    @Mutation(() => SuccessInfo, { name: "addSlider" })
    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    addSlider(
        @Args("sliderInput") sliderInput: SliderInput
    ) {
        return this.homeService.addSlider(sliderInput);
    }

    //Delete Slider
    @Mutation(() => SuccessInfo, { name: "deleteSlider" })
    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    deleteSlider(
        @Args("id", { type: () => ID }) id: ObjectId
    ) {
        return this.homeService.deleteSlider(id);
    }

    //////Section part
    //Get sections
    @Query(() => [Sections], { name: "getSections" })
    getSections() {
        return this.homeService.getSections();
    }

    //Get single sections
    @Query(() => Sections, { name: "getSingleSection" })
    getSingle(
        @Args("id", { type: () => ID }) id: ObjectId
    ) {
        return this.homeService.getSingle(id);
    }

    //Add Section
    @Mutation(() => SuccessInfo, { name: "addSection" })
    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    addSection(
        @Args("sectionInput") sectionInput: SectionInput
    ) {
        return this.homeService.addSection(sectionInput);
    }

    //Update Section
    @Mutation(() => SuccessInfo, { name: "updateSection" })
    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    updateSection(
        @Args("sectionInput") sectionInput: SectionInput,
        @Args("id", { type: () => ID }) id: ObjectId
    ) {
        return this.homeService.updateSection(sectionInput, id);
    }

    //Resolve field for category in get query
    @ResolveField("category", () => Category, { nullable: true })
    getTag(
        @Parent() section: Sections,
        @Context() { loaders }: IGraphQLContext
    ) {
        return loaders.categoryLoader.load(section.category);
    }
}