import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, ObjectId } from "mongoose";

//Schema
import { Wishlist, WishlistDocument } from "./model/wishlist.schema";

//Entities
import { SuccessInfo } from "src/user/entities/success.entity";

//Dto
import { WishlistInput } from "./dto/wishlist.dto";

//Req User Types
import { ReqUser } from "src/auth/types/user.types";

@Injectable()
export class WishlistService {
    //Constructor
    constructor(
        @InjectModel(Wishlist.name) private wishlistModel: Model<WishlistDocument>
    ) { };

    //Get wishlist
    async get(reqUser: ReqUser) {
        const wishlist = await this.wishlistModel.find({
            user: reqUser._id
        });
        return wishlist;
    }

    //Add wishlist
    async add(wishlistInput: WishlistInput, reqUser: ReqUser): Promise<SuccessInfo> {
        const wishlist = await this.wishlistModel.findOne({
            product: wishlistInput.productId,
            user: reqUser._id
        });
        if (wishlist) throw new NotFoundException("Product already listed in wishlist!");
        await this.wishlistModel.create({ product: wishlistInput.productId, user: reqUser._id });
        return {
            success: true,
            message: "Product added to wishlist successfully!"
        }
    }

    //Delete Wishlist
    async delete(id: ObjectId): Promise<SuccessInfo> {
        const result = await this.wishlistModel.findByIdAndDelete(id);
        if (!result) throw new NotFoundException("Wishlist not found!");
        return {
            success: true,
            message: "Wishlist deleted successfully!"
        }
    }
}