import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, ObjectId } from "mongoose";
import omitEmpty from "omit-empty";

//Schema
import { Flash, FlashDocument } from "./model/flash.schema";

//Dto
import { FlashInput } from "./dto/flash.dto";
import { FlashUpdateInput } from "./dto/update.dto";
import { RunningInput } from "./dto/running.dto";

//Entities
import { SuccessInfo } from "src/user/entities/success.entity";

@Injectable()
export class FlashService {
    //Constructor
    constructor(
        @InjectModel(Flash.name) private flashModel: Model<FlashDocument>
    ) { };

    //Get Flashes
    async gets() {
        const flash = await this.flashModel.find({
            start: {
                $lte: Date.now()
            },
            expires: {
                $gte: Date.now()
            }
        });
        return flash;
    }

    //Get flashes by admin
    async getByAdmin() {
        const flash = await this.flashModel.find({
            start: {
                $gte: Date.now()
            }
        });
        return flash;
    }

    //Get Single Flash
    async get(slug: string) {
        const flash = await this.flashModel.findOne({
            slug: slug
        });
        if (!flash) throw new NotFoundException("Flash not found!");
        return flash;
    }

    //Add Flash
    async add(flashInput: FlashInput): Promise<SuccessInfo> {
        flashInput = await omitEmpty(flashInput) as FlashInput;
        const flash = await this.flashModel.findOne({
            title: flashInput.title
        });
        if (flash) throw new NotFoundException("Flash sale already created!");
        await this.flashModel.create(flashInput);
        return {
            success: true,
            message: "Flash sale createdAt successfully!"
        }
    };

    //Update Flash
    async update(flashUpdateInput: FlashUpdateInput, id: ObjectId): Promise<SuccessInfo> {
        flashUpdateInput = await omitEmpty(flashUpdateInput) as FlashUpdateInput;
        const flash = await this.flashModel.findById(id);
        if (!flash) throw new NotFoundException("Flash sale not found!");
        const now = new Date();
        if (now >= flash.start && now <= flash.expires) throw new NotFoundException("You can't update a running flash sale!")
        if (flash.title !== flashUpdateInput.title) {
            const hasFlash = await this.flashModel.findOne({
                title: flashUpdateInput.title
            });
            if (hasFlash) throw new NotFoundException("Flash sale already listed!");
        }
        await this.flashModel.findByIdAndUpdate(id, flashUpdateInput, { new: true });
        return {
            success: true,
            message: "Flash sale updated successfully!"
        }
    }

    //Update running flash sale
    async runningUpdate(runningInput: RunningInput, id: ObjectId) {
        const flash = await this.flashModel.findById(id);
        if (!flash) throw new NotFoundException("Flash sale not found!");
        await this.flashModel.findByIdAndUpdate(id, runningInput, { new: true });
        return {
            success: true,
            message: "Flash sale updated successfully!"
        }
    }

    //Delete Flash sale
    async delete(id: ObjectId): Promise<SuccessInfo> {
        const flash = await this.flashModel.findById(id);
        if (!flash) throw new NotFoundException("Flash not found!");
        const now = new Date();
        if (now >= flash.start && now <= flash.expires) throw new NotFoundException("You can't delete a running flash sale!");
        await this.flashModel.findByIdAndDelete(id);
        return {
            success: true,
            message: "Flash deleted successfully!"
        }
    }

    //Get Flash By Batch
    async findFlashByBatch(Ids: ObjectId[]): Promise<(Flash | Error)[]> {
        const flashes = await this.flashModel.find({ _id: { $in: Ids } });
        const mappedResults = Ids.map(
            (id) =>
                flashes.find((result) => result.id === id.toString())
        );
        return mappedResults;
    }
}