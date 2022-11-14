import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, ObjectId } from "mongoose";
import omitEmpty from "omit-empty";

//Schema
import { Address, AddressDocument } from "./model/address.schema";

//Dto
import { AddressInput } from "./dto/address.dto";
import { UpdateAddressInput } from "./dto/update.dto";

//Entities
import { SuccessInfo } from "src/user/entities/success.entity";

//Types
import { ReqUser } from "src/auth/types/user.types";

@Injectable()
export class AddressService {
    //Constructor
    constructor(
        @InjectModel(Address.name) private addressModel: Model<AddressDocument>
    ) { };

    //Get Address
    async get(reqUser: ReqUser) {
        const address = await this.addressModel.find({
            user: reqUser._id
        });
        return address;
    }

    //Add Address
    async add(addressInput: AddressInput, reqUser: ReqUser): Promise<SuccessInfo> {
        addressInput = await omitEmpty(addressInput) as AddressInput;
        const address = await this.addressModel.countDocuments({
            user: reqUser._id
        });
        await this.addressModel.create({ ...addressInput, default: address === 0 ? true : false, user: reqUser._id });
        return {
            success: true,
            message: "Address added successfully!"
        }
    };

    //Update Address
    async update(updateAddressInput: UpdateAddressInput, id: ObjectId): Promise<SuccessInfo> {
        updateAddressInput = await omitEmpty(updateAddressInput) as UpdateAddressInput;
        const result = await this.addressModel.findByIdAndUpdate(id, updateAddressInput, { new: true });
        if (!result) throw new NotFoundException("Address not found!");
        return {
            success: true,
            message: "Address updated successfully!"
        }
    };

    // Mark address as default address
    async mark(id: ObjectId, reqUser: ReqUser): Promise<SuccessInfo> {
        await this.addressModel.findOneAndUpdate({
            user: reqUser._id,
            default: true
        }, { default: false }, { new: true });
        await this.addressModel.findByIdAndUpdate(id, { default: true }, { new: true });
        return {
            success: true,
            message: "Address is marked as default!"
        }
    };

    //Delete Address
    async delete(id: ObjectId): Promise<SuccessInfo> {
        const address = await this.addressModel.findOneAndDelete({
            _id: id,
            default: false
        });
        if (!address) throw new NotFoundException("Default address can't be deleted!");
        return {
            success: true,
            message: "Address deleted successfully!"
        }
    };

    //Get address by batch
    async findAddressByBatch(Ids: ObjectId[]): Promise<(Address | Error)[]> {
        const address = await this.addressModel.find({ _id: { $in: Ids } });
        const mappedResults = Ids.map(
            (id) =>
                address.find((result) => result.id === id.toString())
        );
        return mappedResults;
    }
}