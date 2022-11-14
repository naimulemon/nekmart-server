import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, ObjectId } from "mongoose";

//Schema
import { Refund, RefundDocument } from "./model/refund.schema";
import { Income, IncomeDocument } from "src/seller/model/income.schema";

//Entities
import { SuccessInfo } from "src/user/entities/success.entity";

//Dto
import { RefundInput } from "./dto/refund.dto";
import { RefundStatusInput } from "./dto/status.dto";

//Types
import { ReqUser } from "src/auth/types/user.types";

//Types
interface OrdersType extends Income {
    createdAt: Date
}

@Injectable()
export class RefundService {
    //Constructor
    constructor(
        @InjectModel(Refund.name) private refundModel: Model<RefundDocument>,
        @InjectModel(Income.name) private incomeModel: Model<IncomeDocument>
    ) { };

    //Get refund by user
    async getByUser(reqUser: ReqUser) {
        const refund = await this.refundModel.find({
            user: reqUser._id
        });
        return refund;
    }

    //Get refund by admin
    async getByAdmin() {
        const refund = await this.refundModel.find();
        return refund;
    }

    //Get single refund by admin
    async getSingle(id: ObjectId) {
        const refund = await this.refundModel.findById(id);
        if (!refund) throw new NotFoundException("Refund not found!");
        return refund;
    }

    //Add Refund
    async add(refundInput: RefundInput, reqUser: ReqUser): Promise<SuccessInfo> {
        const refund = await this.refundModel.findOne({
            user: reqUser._id,
            incomeId: refundInput.incomeId
        })
        if (refund) throw new NotFoundException("You already request refund for this product!");
        const orders: OrdersType = await this.incomeModel.findOne({
            _id: refundInput.incomeId,
            user: reqUser._id
        });
        if (!orders) throw new NotFoundException("No orders found!");
        let deliveryDate = new Date(orders.createdAt);
        const delivery = new Date(deliveryDate.setDate(deliveryDate.getDate() + 7))
        const now = new Date()
        if (delivery <= now) throw new NotFoundException("Return time expired!");
        await this.refundModel.create({
            ...refundInput,
            orderId: orders.orderId,
            user: reqUser._id,
            products: orders.products,
            seller: orders.seller,
            address: orders.address
        });
        await this.incomeModel.findByIdAndUpdate(refundInput.incomeId, { refunded: "Pending" }, { new: true });
        return {
            success: true,
            message: "Refund request placed successfully!"
        }
    }

    //Change Refund status
    async change(id: ObjectId, refundStatusInput: RefundStatusInput): Promise<SuccessInfo> {
        const refund = await this.refundModel.findById(id);
        if (refund.status === "Approved" || refund.status === "Cancelled") throw new NotFoundException("You can't change status now!");
        await this.refundModel.findByIdAndUpdate(id, refundStatusInput, { new: true });
        await this.incomeModel.findByIdAndUpdate(refund.incomeId, {
            refunded: refundStatusInput.status
        }, { new: true });
        return {
            success: true,
            message: "Refund status changed successfully!"
        }
    }
}