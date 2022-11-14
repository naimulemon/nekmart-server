import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, ObjectId } from "mongoose";
import omitEmpty from "omit-empty";

//Schema
import { Attribute, AttributeDocument } from "./model/attributes.schema";

//Dto
import { AttributeInput } from "./dto/attribute.dto";
import { UpdateAttributeInput } from "./dto/update.dto";

//Entities
import { SuccessInfo } from "src/user/entities/success.entity";

@Injectable()
export class AttributeService {
    //Constructor
    constructor(
        @InjectModel(Attribute.name) private attributeModel: Model<AttributeDocument>
    ) { };

    //Get Attributes
    async getAttributes() {
        const attributes = await this.attributeModel.find();
        return attributes;
    };

    //Get single attribute
    async getAttribute(slug: string) {
        const attribute = await this.attributeModel.findOne({
            slug: slug
        });
        if (!attribute) throw new NotFoundException("Attribute not found!");
        return attribute;
    }

    //Add Attributes
    async add(attributeInput: AttributeInput): Promise<SuccessInfo> {
        attributeInput = await omitEmpty(attributeInput) as AttributeInput;
        const attribute = await this.attributeModel.findOne({
            name: attributeInput.name
        });
        if (attribute) throw new NotFoundException("Attribute already added!");
        await this.attributeModel.create(attributeInput);
        return {
            success: true,
            message: "Attributes added successfully!"
        }
    };

    //Update Attributes
    async update(updateAttributeInput: UpdateAttributeInput, id: ObjectId): Promise<SuccessInfo> {
        updateAttributeInput = await omitEmpty(updateAttributeInput) as UpdateAttributeInput;
        const attribute = await this.attributeModel.findById(id);
        if (!attribute) throw new NotFoundException("Attribute not found!");
        if (attribute.name !== updateAttributeInput.name) {
            const hasAttribute = await this.attributeModel.findOne({
                name: updateAttributeInput.name
            });
            if (hasAttribute) throw new NotFoundException("Attribute already listed!");
        };
        await this.attributeModel.findByIdAndUpdate(id, updateAttributeInput, { new: true });
        return {
            success: true,
            message: "Attribute updated successfully!"
        }
    };

    //Delete Attribute
    async delete(id: ObjectId): Promise<SuccessInfo> {
        const result = await this.attributeModel.findByIdAndDelete(id);
        if (!result) throw new NotFoundException("Attribute not found!");
        return {
            success: true,
            message: "Attribute deleted successfully!"
        }
    }
}