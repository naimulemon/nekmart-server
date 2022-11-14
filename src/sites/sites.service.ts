import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

//Schema
import { Site, SiteDocument } from "./model/sites.schema";

//Entities
import { SuccessInfo } from "src/user/entities/success.entity";

//Dto
import { SiteInput } from "./dto/site.dto";

@Injectable()
export class SiteService {
    //Constructor
    constructor(
        @InjectModel(Site.name) private siteModel: Model<SiteDocument>
    ) { };

    //Get Site Settings
    async get() {
        const sites = await this.siteModel.findOne();
        if (!sites) throw new NotFoundException("Please update your site settings first!")
        return sites;
    }

    //Save or add site settings
    async site(siteInput: SiteInput): Promise<SuccessInfo> {
        const sites = await this.siteModel.findOne();
        if (!sites) {
            await this.siteModel.create(siteInput);
        } else {
            await this.siteModel.updateOne({}, siteInput);
        }
        return {
            success: true,
            message: "Site settings saved successfully!"
        }
    }
}