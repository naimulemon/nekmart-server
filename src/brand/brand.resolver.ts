import { Resolver, Mutation, Query, Args, ID } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { ObjectId } from "mongoose";

//Service
import { BrandService } from "./brand.service";

//Dto
import { BrandInput } from "./dto/brand.dto";
import { UpdateBrandInput } from "./dto/update.dto";
import { BrandParams } from "./dto/get-brand.dto";

//Entities
import { SuccessInfo } from "src/user/entities/success.entity";
import { Brand, GetBrands } from "./entities/brand.entity";

//Guards
import { Roles } from "src/auth/decorator/auth.decorator";
import { Role } from "src/auth/enum/auth.enum";
import { AuthGuard } from "src/auth/auth.guard";
import { RolesGuard } from "src/auth/roles.guard";

@Resolver()
export class BrandResolver {
    //Constructor
    constructor(
        private readonly brandService: BrandService
    ) { };

    //Get brands
    @Query(() => GetBrands, { name: "getBrands" })
    getBrands(
        @Args("brandPrams") brandPrams: BrandParams
    ) {
        return this.brandService.getBrands(brandPrams);
    }

    //Get Single Brand
    @Query(() => Brand, { name: "getBrand" })
    getBrand(
        @Args("slug", { type: () => String }) slug: string
    ) {
        return this.brandService.getBrand(slug);
    }

    //Add brand
    @Mutation(() => SuccessInfo, { name: "addBrand" })
    @Roles(Role.MODERATOR, Role.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    add(
        @Args("brandInput") brandInput: BrandInput
    ) {
        return this.brandService.add(brandInput);
    }

    //Update brand
    @Mutation(() => SuccessInfo, { name: "updateBrand" })
    @Roles(Role.MODERATOR, Role.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    update(
        @Args("id", { type: () => ID }) id: ObjectId,
        @Args("updateBrandInput") updateBrandInput: UpdateBrandInput
    ) {
        return this.brandService.update(id, updateBrandInput);
    }


    //Delete Brand
    @Mutation(() => SuccessInfo, { name: "deleteBrand" })
    @Roles(Role.MODERATOR, Role.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    delete(
        @Args("id", { type: () => ID }) id: ObjectId
    ) {
        return this.brandService.delete(id);
    }
}