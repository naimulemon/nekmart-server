import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, ObjectId } from "mongoose";
import omitEmpty from "omit-empty";

//Schema
import { Shipping, ShippingDocument } from "./model/shipping.schema";

//Entities
import { SuccessInfo } from "src/user/entities/success.entity";

//Dto
import { ShippingInput } from "./dto/shipping.dto";
import { ShippingUpdateInput } from "./dto/update.dto";

@Injectable()
export class ShippingService {
    //Constructor
    constructor(
        @InjectModel(Shipping.name) private shippingModel: Model<ShippingDocument>
    ) { };

    //Get Shipping
    async get() {
        const shippings = await this.shippingModel.find();
        return shippings;
    }

    //Get single shipping
    async getSingle(slug: string) {
        const shipping = await this.shippingModel.findOne({
            slug: slug
        });
        if (!shipping) throw new NotFoundException("Shipping not found!");
        return shipping;
    }

    //Add Shipping
    async add(shippingInput: ShippingInput): Promise<SuccessInfo> {
        shippingInput = await omitEmpty(shippingInput) as ShippingInput;
        const shipping = await this.shippingModel.findOne({
            name: shippingInput.name
        });
        if (shipping) throw new NotFoundException("Shipping method already added!");
        await this.shippingModel.create(shippingInput);
        return {
            success: true,
            message: "Shipping created successfully!"
        }
    }

    //Update Shipping
    async update(shippingUpdateInput: ShippingUpdateInput, id: ObjectId): Promise<SuccessInfo> {
        shippingUpdateInput = await omitEmpty(shippingUpdateInput) as ShippingUpdateInput;
        const shipping = await this.shippingModel.findById(id);
        if (!shipping) throw new NotFoundException("Shipping not found!");
        if (shipping.name !== shippingUpdateInput.name) {
            const hasShipping = await this.shippingModel.findOne({
                name: shippingUpdateInput.name
            });
            if (hasShipping) throw new NotFoundException("Shipping already listed");
        }
        await this.shippingModel.findByIdAndUpdate(id, shippingUpdateInput, { new: true });
        return {
            success: true,
            message: "Shipping updated successfully!"
        }
    }

    //Delete Shipping
    async delete(id: ObjectId): Promise<SuccessInfo> {
        const result = await this.shippingModel.findByIdAndDelete(id);
        if (!result) throw new NotFoundException("Shipping not found!");
        return {
            success: true,
            message: "Shipping deleted successfully!"
        }
    }

    //Get Shipping by Batch
    async findShippingByBatch(Ids: ObjectId[]): Promise<(Shipping | Error)[]> {
        const shippings = await this.shippingModel.find({ _id: { $in: Ids } });
        const mappedResults = Ids.map(
            (id) =>
                shippings.find((result) => result.id === id.toString())
        );
        return mappedResults;
    }
}