import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, ObjectId } from "mongoose";

//Schema
import { Preorder, PreorderDocument } from "./model/preorder.schema";

//Dto
import { PreorderInput } from "./dto/preorder.dto";
import { PreorderNoteInput } from "./dto/update.dto";

//Entities
import { SuccessInfo } from "src/user/entities/success.entity";

@Injectable()
export class PreorderService {
    //Constructor
    constructor(
        @InjectModel(Preorder.name) private preorderModel: Model<PreorderDocument>
    ) { };

    //Get Preorder
    async get() {
        const preorder = await this.preorderModel.find();
        return preorder;
    }

    //Add preorder
    async add(preorderInput: PreorderInput): Promise<SuccessInfo> {
        await this.preorderModel.create(preorderInput);
        return {
            success: true,
            message: "Preorder request placed successfully!"
        }
    };

    //Update preorder note
    async update(preorderNoteInput: PreorderNoteInput, id: ObjectId): Promise<SuccessInfo> {
        const result = await this.preorderModel.findByIdAndUpdate(id, { note: preorderNoteInput.note }, { new: true });
        if (!result) throw new NotFoundException("Pre-order not found!");
        return {
            success: true,
            message: "Pre-order updated successfully!"
        }
    }

    //Delete Preorder
    async delete(id: ObjectId): Promise<SuccessInfo> {
        const result = await this.preorderModel.findByIdAndDelete(id);
        if (!result) throw new NotFoundException("Pre-order not found!");
        return {
            success: true,
            message: "Pre-order deleted successfully!"
        }
    }
}