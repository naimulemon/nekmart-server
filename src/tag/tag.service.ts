import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, ObjectId } from "mongoose";
import omitEmpty from "omit-empty";

//Schema
import { Tag, TagDocument } from "./model/tag.schema";

//Entity
import { SuccessInfo } from "src/user/entities/success.entity";

//Dto
import { TagInput } from "./dto/tag.dto";
import { UpdateTagInput } from "./dto/update.dto";
import { TagPrams } from "./dto/get-tags.dto";

@Injectable()
export class TagService {
    //Constructor
    constructor(
        @InjectModel(Tag.name) private tagModel: Model<TagDocument>
    ) { };

    //Get tags
    async getTags(tagPrams: TagPrams) {
        let tags = await this.tagModel.find({
            name: {
                '$regex': tagPrams.search ? tagPrams.search : "",
                '$options': 'i'
            }
        }).sort({ _id: -1 }).limit(tagPrams.limit + 1).skip(tagPrams.skip);
        const count = await this.tagModel.countDocuments({
            name: {
                '$regex': tagPrams.search ? tagPrams.search : "",
                '$options': 'i'
            }
        });
        const hasNextPage = tags.length > tagPrams.limit;
        tags = hasNextPage ? tags.slice(0, -1) : tags;
        return {
            success: true,
            tags,
            pageInfos: {
                hasNextPage,
                count
            }
        }
    };

    //Get Tag
    async getTag(slug: string) {
        const tag = await this.tagModel.findOne({
            slug: slug
        });
        if (!tag) throw new NotFoundException("Tag is not found!");
        return tag;
    };

    //Add tag
    async addTag(tagInput: TagInput): Promise<SuccessInfo> {
        tagInput = await omitEmpty(tagInput) as TagInput;
        const tag = await this.tagModel.findOne({
            name: tagInput.name
        });
        if (tag) throw new NotFoundException("Tag already created!");
        await this.tagModel.create(tagInput);
        return {
            success: true,
            message: "Tag created successfully!"
        }
    };

    //Update tag
    async update(id: ObjectId, updateTagInput: UpdateTagInput): Promise<SuccessInfo> {
        updateTagInput = await omitEmpty(updateTagInput) as UpdateTagInput;
        const tag = await this.tagModel.findById(id);
        if (!tag) throw new NotFoundException("Tag not found!");
        if (tag.name !== updateTagInput.name) {
            const hasTag = await this.tagModel.findOne({
                name: updateTagInput.name
            });
            if (hasTag) throw new NotFoundException("Tag already listed!");
        }
        await this.tagModel.findByIdAndUpdate(tag._id, updateTagInput, { new: true });
        return {
            success: true,
            message: "Tag is updated successfully!"
        }
    };

    //Delete Tag
    async delete(id: ObjectId): Promise<SuccessInfo> {
        const result = await this.tagModel.findByIdAndDelete(id);
        if (!result) throw new NotFoundException("Tag not found");
        return {
            success: true,
            message: "Tag deleted successfully!"
        }
    };

    //Tag By Batch Query
    async findTagByBatch(Ids: ObjectId[]): Promise<(Tag | Error)[]> {
        const tags = await this.tagModel.find({ _id: { $in: Ids } });
        const mappedResults = Ids.map(
            (id) =>
                tags.find((result) => result.id === id.toString())
        );
        return mappedResults;
    }
}