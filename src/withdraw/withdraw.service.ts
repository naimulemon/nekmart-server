import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, ObjectId } from "mongoose";

//Schema
import { Withdraw, WithdrawDocument } from "./model/withdraw.schema";
import { Income, IncomeDocument } from "src/seller/model/income.schema";
import { Seller, SellerDocument } from "src/seller/model/seller.schema";
import { Platform, PlatformDocument } from "src/platform/model/platform.schema";

//Entities
import { SuccessInfo } from "src/user/entities/success.entity";

//Dto
import { ReleasePaymentInput } from "./dto/payment.dto";

//Types
import { ReqUser } from "src/auth/types/user.types";


@Injectable()
export class WithdrawService {
    //Constructor
    constructor(
        @InjectModel(Withdraw.name) private withdrawModel: Model<WithdrawDocument>,
        @InjectModel(Income.name) private incomeModel: Model<IncomeDocument>,
        @InjectModel(Seller.name) private sellerModel: Model<SellerDocument>,
        @InjectModel(Platform.name) private platformModel: Model<PlatformDocument>,
    ) { }

    //Get withdrawal
    async get(sellerId: ObjectId, reqUser: ReqUser) {
        if (reqUser.role === "seller") {
            const seller = await this.sellerModel.findOne({
                user: reqUser._id
            });
            if (!seller) return [];
        }
        const withdraw = await this.withdrawModel.find({
            seller: sellerId
        });
        return withdraw;
    }

    //Get payment by delivered after 7 days
    async getAfter(sellerId: ObjectId) {
        let date = new Date();
        date = new Date(date.setDate(date.getDate() - 7));
        const income = await this.incomeModel.find({
            createdAt: {
                $lt: date
            },
            seller: sellerId,
            paySuccess: false,
            refunded: {
                $nin: ["Approved", "Pending"]
            }
        });
        const platform = await this.platformModel.findOne();
        let total = income.reduce((acc, item) => item.income + acc, 0);
        total = total - (total * (platform.charge / 100));
        return {
            amount: total,
            incomes: income
        }
    }

    //Get current payment into 7 days
    async getCurrent(sellerId: ObjectId) {
        let date = new Date();
        date = new Date(date.setDate(date.getDate() - 7));
        const income = await this.incomeModel.find({
            createdAt: {
                $gt: date
            },
            seller: sellerId,
            paySuccess: false,
            refunded: {
                $nin: ["Approved"]
            }
        });
        const platform = await this.platformModel.findOne();
        let total = income.reduce((acc, item) => item.income + acc, 0);
        total = total - (total * (platform.charge / 100));
        return {
            amount: total,
            incomes: income
        }
    }

    //Get processing payment from seller
    async process(reqUser: ReqUser) {
        const seller = await this.sellerModel.findOne({
            user: reqUser._id
        });
        const withdrawal = await this.withdrawModel.find({
            status: "Processing",
            seller: seller._id
        });
        return withdrawal;
    }


    //Release payment
    async release(paymentInput: ReleasePaymentInput, reqUser: ReqUser): Promise<SuccessInfo> {
        let date = new Date();
        date = new Date(date.setDate(date.getDate() - 7));
        const income = await this.incomeModel.find({
            createdAt: {
                $lt: date
            },
            seller: paymentInput.seller,
            paySuccess: false,
            refunded: {
                $nin: ["Approved", "Pending"]
            }
        });
        const total = income.reduce((acc, item) => item.income + acc, 0);
        if (paymentInput.amount !== total) throw new NotFoundException("Something went wrong!");
        await this.withdrawModel.create({
            ...paymentInput,
            releasedBy: reqUser.name,
        })
        await this.incomeModel.updateMany({
            _id: paymentInput.incomesIds
        }, { paySuccess: true }, { new: true })
        await this.sellerModel.findByIdAndUpdate(paymentInput.seller, {
            lastPaymentDate: Date.now()
        }, { new: true })
        return {
            success: true,
            message: "Payment released successfully!"
        }
    }

    //Confirm payment by seller
    async confirm(withdrawId: ObjectId): Promise<SuccessInfo> {
        const result = await this.withdrawModel.findByIdAndUpdate(withdrawId, {
            status: "Confirmed"
        });
        if (!result) throw new NotFoundException("Withdraw release not found!");
        return {
            success: true,
            message: "Payment confirmed by seller!"
        }
    }
}