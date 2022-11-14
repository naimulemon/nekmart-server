import { Resolver, Mutation, Query, Args, ID } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { ObjectId } from "mongoose";

//Service
import { PreorderService } from "./preorder.service";

//Dto
import { PreorderInput } from "./dto/preorder.dto";
import { PreorderNoteInput } from "./dto/update.dto";

//Entities
import { SuccessInfo } from "src/user/entities/success.entity";
import { Preorder } from "./entities/preorder.entity";

//Guard
import { Roles } from "src/auth/decorator/auth.decorator";
import { Role } from "src/auth/enum/auth.enum";
import { AuthGuard } from "src/auth/auth.guard";
import { RolesGuard } from "src/auth/roles.guard";

@Resolver()
export class PreorderResolver {
    //Constructor
    constructor(
        private readonly preorderService: PreorderService
    ) { };

    //Get preorder
    @Query(() => [Preorder], { name: "getPreorder" })
    @Roles(Role.EDITOR, Role.MODERATOR, Role.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    get() {
        return this.preorderService.get();
    }

    //Add Preorder
    @Mutation(() => SuccessInfo, { name: "addPreorder" })
    add(
        @Args("preorderInput") preorderInput: PreorderInput
    ) {
        return this.preorderService.add(preorderInput);
    }

    //Update preorder Note
    @Mutation(() => SuccessInfo, { name: "updatePreorderNote" })
    @Roles(Role.EDITOR, Role.MODERATOR, Role.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    update(
        @Args("preorderNoteInput") preorderNoteInput: PreorderNoteInput,
        @Args("id", { type: () => ID }) id: ObjectId
    ) {
        return this.preorderService.update(preorderNoteInput, id);
    }

    //Delete Preorder
    @Mutation(() => SuccessInfo, { name: "deletePreorder" })
    @Roles(Role.EDITOR, Role.MODERATOR, Role.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    delete(
        @Args("id", { type: () => ID }) id: ObjectId
    ) {
        return this.preorderService.delete(id);
    }
}