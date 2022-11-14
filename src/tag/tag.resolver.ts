import { Resolver, Mutation, Query, Args, ID } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { ObjectId } from "mongoose";

//Service
import { TagService } from "./tag.service";

//Dto
import { TagInput } from "./dto/tag.dto";
import { UpdateTagInput } from "./dto/update.dto";
import { TagPrams } from "./dto/get-tags.dto";

//Entity
import { SuccessInfo } from "src/user/entities/success.entity";
import { Tag, GetTags } from "./entities/tag.entity";

//Guards
import { Roles } from "src/auth/decorator/auth.decorator";
import { Role } from "src/auth/enum/auth.enum";
import { AuthGuard } from "src/auth/auth.guard";
import { RolesGuard } from "src/auth/roles.guard";

@Resolver()
export class TagResolver {
    //Constructor
    constructor(
        private readonly tagService: TagService
    ) { };

    //Get Tags
    @Query(() => GetTags, { name: "getTags" })
    getTags(
        @Args("tagPrams") tagPrams: TagPrams
    ) {
        return this.tagService.getTags(tagPrams);
    };

    //Get Tag
    @Query(() => Tag, { name: "getTag" })
    getTag(
        @Args("slug", { type: () => String }) slug: string
    ) {
        return this.tagService.getTag(slug);
    };

    //Add Tag
    @Mutation(() => SuccessInfo, { name: "addTag" })
    @Roles(Role.MODERATOR, Role.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    addTag(
        @Args("tagInput") tagInput: TagInput
    ) {
        return this.tagService.addTag(tagInput);
    };

    //Update Tag
    @Mutation(() => SuccessInfo, { name: "updateTag" })
    @Roles(Role.MODERATOR, Role.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    update(
        @Args("id", { type: () => ID }) id: ObjectId,
        @Args("updateTagInput") updateTagInput: UpdateTagInput
    ) {
        return this.tagService.update(id, updateTagInput);
    };

    //Delete Tag
    @Mutation(() => SuccessInfo, { name: "deleteTag" })
    @Roles(Role.MODERATOR, Role.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    delete(
        @Args("id", { type: () => ID }) id: ObjectId
    ) {
        return this.tagService.delete(id);
    };
}