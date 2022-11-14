import { Resolver, Mutation, Query, Args, ID } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { ObjectId } from "mongoose";

//Service
import { AttributeService } from "./attributes.service";

//Dto
import { AttributeInput } from "./dto/attribute.dto";
import { UpdateAttributeInput } from "./dto/update.dto";

//Entities
import { SuccessInfo } from "src/user/entities/success.entity";
import { Attribute } from "./entities/attribute.entity";

//Guards
import { Roles } from "src/auth/decorator/auth.decorator";
import { Role } from "src/auth/enum/auth.enum";
import { AuthGuard } from "src/auth/auth.guard";
import { RolesGuard } from "src/auth/roles.guard";

@Resolver()
export class AttributeResolver {
    //Constructor
    constructor(
        private readonly attributeService: AttributeService
    ) { };

    //Get attributes
    @Query(() => [Attribute], { name: "getAttributes" })
    @Roles(Role.SELLER, Role.EDITOR, Role.MODERATOR, Role.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    getAttributes() {
        return this.attributeService.getAttributes();
    };

    //Get single attributes
    @Query(() => Attribute, { name: "getAttribute" })
    @Roles(Role.SELLER, Role.EDITOR, Role.MODERATOR, Role.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    getAttribute(
        @Args("slug", { type: () => String }) slug: string
    ) {
        return this.attributeService.getAttribute(slug);
    }

    //Add Attributes
    @Mutation(() => SuccessInfo, { name: "addAttribute" })
    @Roles(Role.MODERATOR, Role.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    add(
        @Args("attributeInput") attributeInput: AttributeInput
    ) {
        return this.attributeService.add(attributeInput);
    };

    //Update Attributes
    @Mutation(() => SuccessInfo, { name: "updateAttribute" })
    @Roles(Role.MODERATOR, Role.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    update(
        @Args("updateAttributeInput") updateAttributeInput: UpdateAttributeInput,
        @Args("id", { type: () => ID }) id: ObjectId
    ) {
        return this.attributeService.update(updateAttributeInput, id);
    };

    //Delete Attribute
    @Mutation(() => SuccessInfo, { name: "deleteAttribute" })
    @Roles(Role.MODERATOR, Role.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    delete(
        @Args("id", { type: () => ID }) id: ObjectId
    ) {
        return this.attributeService.delete(id);
    }
}