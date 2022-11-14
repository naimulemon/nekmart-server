import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, ObjectId } from "mongoose";
import * as otpGenerator from "otp-generator";
import omitEmpty from "omit-empty";

//Schema
import { Coupon, CouponDocument } from "./model/coupon.schema";
import { User, UserDocument } from "src/user/model/user.schema";

//Entities
import { SuccessInfo } from "src/user/entities/success.entity";
import { RedeemInfo } from "./entities/redeem.entity";
import { ApplyInfo } from "./entities/apply.entity";

//Dto
import { CouponInput } from "./dto/coupon.dto";
import { CouponUpdateInput } from "./dto/update.dto";
import { RedeemInput } from "./dto/redeem.dto";
import { ApplyInput } from "./dto/apply.dto";

//Types
import { ReqUser } from "src/auth/types/user.types";

@Injectable()
export class CouponService {
    //Constructor
    constructor(
        @InjectModel(Coupon.name) private couponModel: Model<CouponDocument>,
        @InjectModel(User.name) private userModel: Model<UserDocument>
    ) { };

    //Get Coupon by user
    async getByUser(reqUser: ReqUser) {
        const coupon = await this.couponModel.find({
            user: reqUser._id
        });
        return coupon;
    }

    //Get Coupon by admin
    async getByAdmin() {
        const coupon = await this.couponModel.find({
            user: {
                $exists: false
            },
            expires: {
                $exists: true
            }
        })
        return coupon;
    }

    //Get Single coupon by admin
    async getSingleByAdmin(slug) {
        const coupon = await this.couponModel.findOne({
            slug: slug,
            user: {
                $exists: false
            },
            expires: {
                $exists: true
            }
        })
        if (!coupon) throw new NotFoundException("Coupon not found!");
        return coupon;
    }

    //Add Coupon
    async add(couponInput: CouponInput): Promise<SuccessInfo> {
        couponInput = await omitEmpty(couponInput) as CouponInput;
        const coupon = await this.couponModel.findOne({
            code: couponInput.code
        });
        if (coupon) throw new NotFoundException("Coupon already exist!");
        await this.couponModel.create(couponInput);
        return {
            success: true,
            message: "Coupon added successfully!"
        }
    }

    //Redeem Coupon
    async redeem(redeemInput: RedeemInput, reqUser: ReqUser): Promise<RedeemInfo> {
        redeemInput = await omitEmpty(redeemInput) as RedeemInput;
        const user = await this.userModel.findById(reqUser._id);
        if (user.points <= redeemInput.points) throw new NotFoundException("You have not enough points!")
        const code = otpGenerator.generate(10, {
            digits: false,
            lowerCaseAlphabets: false,
            upperCaseAlphabets: true,
            specialChars: false
        });
        await this.couponModel.create({ ...redeemInput, name: code, code, discountUnit: "flat", user: reqUser._id });
        await this.userModel.findByIdAndUpdate(reqUser._id, {
            $inc: {
                points: -redeemInput.points
            }
        })
        return {
            success: true,
            message: "Redeem Successful!",
            code
        }
    }

    //Update Coupon
    async update(couponUpdateInput: CouponUpdateInput, id: ObjectId): Promise<SuccessInfo> {
        couponUpdateInput = await omitEmpty(couponUpdateInput) as CouponUpdateInput;
        const coupon = await this.couponModel.findById(id);
        if (!coupon) throw new NotFoundException("Coupon not found!");
        if (coupon.code !== couponUpdateInput.code) {
            const hasCoupon = await this.couponModel.findOne({
                code: couponUpdateInput.code
            });
            if (hasCoupon) throw new NotFoundException("Coupon code is already in use!");
        }
        await this.couponModel.findByIdAndUpdate(id, couponUpdateInput, { new: true });
        return {
            success: true,
            message: "Coupon updated successfully!"
        }
    };

    //Apply Coupon
    async apply(applyInput: ApplyInput, reqUser: ReqUser): Promise<ApplyInfo> {
        const coupon = await this.couponModel.findOne({
            code: applyInput.code
        });
        if (!coupon) throw new NotFoundException("You use a wrong coupon code!");
        if (!applyInput.minPurchase) throw new NotFoundException("Please provide minimum purchase unit!");
        if (applyInput.minPurchase < coupon.minimumPurchase) throw new NotFoundException(`You have to buy more than ${coupon.minimumPurchase}`);
        if (coupon?.user) {
            if (coupon.user.toString() !== reqUser._id.toString()) throw new NotFoundException("Something went wrong!");
            await this.couponModel.findOneAndDelete({
                code: applyInput.code
            })
            return {
                success: true,
                message: "Coupon redeemed successful!",
                discount: coupon.discount,
                discountUnit: coupon.discountUnit
            }
        }
        const now = new Date();
        if (now > coupon.expires) throw new NotFoundException("The code is expired!");
        return {
            success: true,
            message: "Coupon redeemed successful!",
            discount: coupon.discount,
            discountUnit: coupon.discountUnit
        }
    }

    //Delete Coupon 
    async delete(id: ObjectId): Promise<SuccessInfo> {
        const result = await this.couponModel.findByIdAndDelete(id);
        if (!result) throw new NotFoundException("Coupon not found!");
        return {
            success: true,
            message: "Coupon deleted successfully!"
        }
    }
}