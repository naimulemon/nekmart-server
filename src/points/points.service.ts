import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

//Schema
import { Points, PointDocument } from "./model/points.schema";
import { User, UserDocument } from "src/user/model/user.schema";

//Types
import { ReqUser } from "src/auth/types/user.types";

@Injectable()
export class PointService {
    //Constructor
    constructor(
        @InjectModel(Points.name) private pointModel: Model<PointDocument>,
        @InjectModel(User.name) private userModel: Model<UserDocument>
    ) { };

    //Get Points
    async get(reqUser: ReqUser) {
        const points = await this.pointModel.find({
            user: reqUser._id
        });
        const user = await this.userModel.findById(reqUser._id);
        return {
            totalPoints: user?.points ? user.points : 0,
            history: points
        }
    }
}