import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

//Schema
import { Platform, PlatformDocument } from "./model/platform.schema";

//Dto
import { PlatformInput } from "./dto/platform.dto";

//Entities
import { SuccessInfo } from "src/user/entities/success.entity";

@Injectable()
export class PlatformService {
    //Constructor
    constructor(
        @InjectModel(Platform.name) private platformModel: Model<PlatformDocument>
    ) { };

    //Get platforms
    async get() {
        const platform = await this.platformModel.findOne();
        if (!platform) throw new NotFoundException("Please add platform now!");
        return platform;
    }

    //Add platform
    async add(platformInput: PlatformInput): Promise<SuccessInfo> {
        const platform = await this.platformModel.findOne();
        if (platform) {
            await this.platformModel.updateOne({
                charge: platformInput.charge
            })
        } else {
            await this.platformModel.create({ charge: platformInput.charge });
        }
        return {
            success: true,
            message: "Platform updated successfully!"
        }
    }
}