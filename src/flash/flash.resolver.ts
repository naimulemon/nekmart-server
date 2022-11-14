import { Resolver, Mutation, Query, Args, ID } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { ObjectId } from "mongoose";

//Service
import { FlashService } from "./flash.service";

//Dto
import { FlashInput } from "./dto/flash.dto";
import { FlashUpdateInput } from "./dto/update.dto";
import { RunningInput } from "./dto/running.dto";

//Entities
import { SuccessInfo } from "src/user/entities/success.entity";
import { Flash } from "./entities/flash.entity";

//Guard
import { Roles } from "src/auth/decorator/auth.decorator";
import { Role } from "src/auth/enum/auth.enum";
import { AuthGuard } from "src/auth/auth.guard";
import { RolesGuard } from "src/auth/roles.guard";

@Resolver()
export class FlashResolver {
    //Constructor
    constructor(
        private readonly flashService: FlashService
    ) { };

    //Get Flashes
    @Query(() => [Flash], { name: "getFlashes" })
    gets() {
        return this.flashService.gets();
    }

    //Get Flashes by admin
    @Query(() => [Flash], { name: "getFlashAdmin" })
    @Roles(Role.SELLER, Role.MODERATOR, Role.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    getFlash() {
        return this.flashService.getByAdmin();
    }

    //Get Single Flash
    @Query(() => Flash, { name: "getFlash" })
    get(
        @Args("slug", { type: () => String }) slug: string
    ) {
        return this.flashService.get(slug);
    }

    //Add Flash sale
    @Mutation(() => SuccessInfo, { name: "addFlash" })
    @Roles(Role.MODERATOR, Role.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    add(
        @Args("flashInput") flashInput: FlashInput
    ) {
        return this.flashService.add(flashInput);
    }

    //Update Flash sale
    @Mutation(() => SuccessInfo, { name: "updateFlash" })
    @Roles(Role.MODERATOR, Role.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    update(
        @Args("flashUpdateInput") flashUpdateInput: FlashUpdateInput,
        @Args("id", { type: () => ID }) id: ObjectId
    ) {
        return this.flashService.update(flashUpdateInput, id);
    }

    //Update running flash sale
    @Mutation(() => SuccessInfo, { name: "updateRunningSale" })
    @Roles(Role.MODERATOR, Role.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    updateRunning(
        @Args("runningInput") runningInput: RunningInput,
        @Args("id", { type: () => ID }) id: ObjectId
    ) {
        return this.flashService.runningUpdate(runningInput, id);
    }

    //Delete Flash sale
    @Mutation(() => SuccessInfo, { name: "deleteFlash" })
    @Roles(Role.MODERATOR, Role.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    delete(
        @Args("id", { type: () => ID }) id: ObjectId
    ) {
        return this.flashService.delete(id);
    }
}