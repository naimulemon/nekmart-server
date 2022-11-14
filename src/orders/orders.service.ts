import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, ObjectId } from "mongoose";
import axios from "axios";
import omitEmpty from "omit-empty";

//Helpers
import { getOrderId } from "src/helpers/orderId";

//Schema
import { Orders, OrderDocument } from "./model/orders.schema";
import { Income, IncomeDocument } from "src/seller/model/income.schema";
import { Seller, SellerDocument } from "src/seller/model/seller.schema";
import { Cart, CartDocument } from "src/cart/model/cart.schema";
import { Points, PointDocument } from "src/points/model/points.schema";
import { User, UserDocument } from "src/user/model/user.schema";
import { Product, ProductDocument } from "src/product/model/product.schema";

//Entities
import { SuccessInfo } from "src/user/entities/success.entity";

//Dto
import { OrderInput } from "./dto/orders.dto";
import { SellerStatusInput } from "./dto/seller-status.dto";
import { CancelStatusInput } from "./dto/cancel-status.dto";
import { AdminStatusInput } from "./dto/admin-status.dto";
import { TrackInput } from "./dto/track.dto";

//Types
import { ReqUser } from "src/auth/types/user.types";

@Injectable()
export class OrderService {
    //Constructor
    constructor(
        @InjectModel(Orders.name) private orderModel: Model<OrderDocument>,
        @InjectModel(Income.name) private incomeModel: Model<IncomeDocument>,
        @InjectModel(Seller.name) private sellerModel: Model<SellerDocument>,
        @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
        @InjectModel(Points.name) private pointModel: Model<PointDocument>,
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(Product.name) private productModel: Model<ProductDocument>
    ) { };

    //Get Orders
    async getOrders() {
        const orders = await this.orderModel.find().sort({ _id: -1 });
        return orders;
    };

    //Get Single order
    async getOrder(id: ObjectId) {
        const order = await this.orderModel.findById(id);
        if (!order) throw new NotFoundException("Order not found!");
        return order;
    }

    //Get Order by User
    async getOrderByUser(reqUser: ReqUser) {
        const orders = await this.orderModel.find({
            user: reqUser._id
        });
        return orders;
    }

    //Get order by seller
    async getOrderBySeller(reqUser: ReqUser) {
        const seller = await this.sellerModel.findOne({
            user: reqUser._id
        });
        const order = await this.orderModel.aggregate([
            { $match: { "productInfo.seller": seller._id } },
            { $unwind: '$productInfo' },
            { $match: { 'productInfo.seller': seller._id } }
        ])
        return order;
    }

    //Get single order by seller
    async getSingleBySeller(orderId: ObjectId, reqUser: ReqUser) {
        const seller = await this.sellerModel.findOne({
            user: reqUser._id
        });
        const order = await this.orderModel.aggregate([
            { $match: { "productInfo.seller": seller._id } },
            { $unwind: '$productInfo' },
            { $match: { 'productInfo.seller': seller._id } }
        ])
        const result = order.find((item) => item._id.toString() === orderId.toString())
        return result;
    }

    //Track order
    async track(trackInput: TrackInput) {
        const track = await this.orderModel.findOne({
            orderId: trackInput.trackId
        });
        if (!track) throw new NotFoundException("Order not found!");
        return track;
    }

    //Add Order
    async add(orderInput: OrderInput, reqUser: ReqUser) {
        orderInput = await omitEmpty(orderInput) as OrderInput;
        const uniqueValues = new Set(orderInput.productInfo.map(v => v.seller));
        if (uniqueValues.size < orderInput.productInfo.length) throw new NotFoundException("You have to sort productInfo by seller!");
        if (orderInput.productInfo.length === 0 || orderInput.carts.length === 0) throw new NotFoundException("Please add some product to your cart!");
        const result = await this.orderModel.create({ ...orderInput, orderId: getOrderId(), user: reqUser._id });
        await this.cartModel.deleteMany({
            _id: orderInput.carts
        });
        return result;
    };

    //Change order status by seller
    async sellerStatus(sellerStatusInput: SellerStatusInput, id: ObjectId, reqUser: ReqUser): Promise<SuccessInfo> {
        const sellerId = await this.sellerModel.findOne({
            user: reqUser._id
        });
        if (sellerId.banned || sellerId.hidden) throw new NotFoundException("You are restricted!");
        if (sellerId._id.toString() !== sellerStatusInput.ownId.toString()) throw new NotFoundException("You haven't access to do this action!");
        const order = await this.orderModel.findById(id);
        if (!order) throw new NotFoundException("Order not found!");
        const seller = order.productInfo.find((item) => item.seller.toString() === sellerStatusInput.ownId.toString());
        if (!seller) throw new NotFoundException("You haven't access to do this action!");
        if (seller.status === "Pending") {
            await this.orderModel.findOneAndUpdate({
                _id: id,
                "productInfo.seller": sellerStatusInput.ownId
            }, {
                "$set": {
                    "productInfo.$.status": sellerStatusInput.status
                }
            }, { new: true });
        } else {
            throw new NotFoundException("You haven't access to do this action!")
        }
        if (sellerStatusInput.status === "Confirmed") {
            const products = seller.products
            for (let key in products) {
                await this.productModel.findByIdAndUpdate(products[key].productId, {
                    $inc: {
                        quantity: -products[key].quantity
                    }
                })
            }
        }
        const user = await this.userModel.findOne({
            _id: order.user
        })
        const greenwebsms = new URLSearchParams();
        greenwebsms.append('token', process.env.SMS_TOKEN);
        greenwebsms.append('to', `+${user.phone}`);
        greenwebsms.append('message', `Your delivery status has been updated to ${sellerStatusInput.status} for nekmart order code ${order.orderId}`);
        axios.post('http://api.greenweb.com.bd/api.php', greenwebsms)
        return {
            success: true,
            message: "Order status changed successfully!"
        }
    };

    //Cancel order status by seller
    async cancelBySeller(cancelStatusInput: CancelStatusInput, reqUser: ReqUser): Promise<SuccessInfo> {
        const sellerId = await this.sellerModel.findOne({
            user: reqUser._id
        });
        if (sellerId.banned || sellerId.hidden) throw new NotFoundException("You are restricted!");
        if (sellerId._id.toString() !== cancelStatusInput.ownId.toString()) throw new NotFoundException("You haven't access to do this action!");
        const order = await this.orderModel.findById(cancelStatusInput.id);
        if (!order) throw new NotFoundException("Order not found!");
        const seller = order.productInfo.find((item) => item.seller.toString() === cancelStatusInput.ownId.toString());
        if (!seller) throw new NotFoundException("You haven't access to do this action!");
        if (seller.status === "Pending") {
            await this.orderModel.findOneAndUpdate({
                _id: cancelStatusInput.id,
                "productInfo.seller": cancelStatusInput.ownId
            }, {
                "$set": {
                    "productInfo.$.status": "Cancelled",
                    "productInfo.$.cancelBy": "Seller"
                }
            }, { new: true });
        } else {
            throw new NotFoundException("You haven't access to do this action!")
        }
        const user = await this.userModel.findOne({
            _id: order.user
        })
        const greenwebsms = new URLSearchParams();
        greenwebsms.append('token', process.env.SMS_TOKEN);
        greenwebsms.append('to', `+${user.phone}`);
        greenwebsms.append('message', `Your delivery status has been updated to Cancelled for nekmart order code ${order.orderId}`);
        axios.post('http://api.greenweb.com.bd/api.php', greenwebsms)
        return {
            success: true,
            message: "Order cancelled successfully!"
        }
    }

    //Change status by admin
    async adminStatus(adminStatusInput: AdminStatusInput): Promise<SuccessInfo> {
        const order = await this.orderModel.findById(adminStatusInput.id);
        if (!order) throw new NotFoundException("Order not found!");
        const seller = order.productInfo.find((item) => item.seller.toString() === adminStatusInput.sellerId.toString());
        if (!seller) throw new NotFoundException("Seller not found under this order!");
        if (seller.status === "Delivered") throw new NotFoundException("You can't change a delivered order status!");
        await this.orderModel.findOneAndUpdate({
            _id: adminStatusInput.id,
            "productInfo.seller": adminStatusInput.sellerId
        }, {
            "$set": {
                "productInfo.$.status": adminStatusInput.status
            }
        }, { new: true });
        if (adminStatusInput.status === "Delivered") {
            await this.pointModel.create({ user: order.user, order: order._id, points: Math.round(order.subtotal / 10) });
            await this.userModel.findByIdAndUpdate(order.user, {
                $inc: {
                    points: Math.round(order.subtotal / 10)
                }
            }, { new: true })
            await this.incomeModel.create({
                seller: seller.seller,
                user: order.user,
                address: order.shippingAddress,
                orderId: order._id,
                products: seller.products,
                income: seller.price
            })
        }
        const user = await this.userModel.findOne({
            _id: order.user
        })
        const greenwebsms = new URLSearchParams();
        greenwebsms.append('token', process.env.SMS_TOKEN);
        greenwebsms.append('to', `+${user.phone}`);
        greenwebsms.append('message', `Your delivery status has been updated to ${adminStatusInput.status} for nekmart order code ${order.orderId}`);
        axios.post('http://api.greenweb.com.bd/api.php', greenwebsms)
        return {
            success: true,
            message: "Order status changed successfully!"
        }
    }

    //Cancel order status by admin
    async cancelByAdmin(cancelStatusInput: CancelStatusInput): Promise<SuccessInfo> {
        const order = await this.orderModel.findById(cancelStatusInput.id);
        if (!order) throw new NotFoundException("Order not found!");
        const seller = order.productInfo.find((item) => item.seller.toString() === cancelStatusInput.ownId.toString());
        if (!seller) throw new NotFoundException("Seller not found under this order!");
        if (seller.status === "Delivered") throw new NotFoundException("You can't change a delivered order status!");
        await this.orderModel.findOneAndUpdate({
            _id: cancelStatusInput.id,
            "productInfo.seller": cancelStatusInput.ownId
        }, {
            "$set": {
                "productInfo.$.status": "Cancelled",
                "productInfo.$.cancelBy": "Admin"
            }
        }, { new: true });
        const user = await this.userModel.findOne({
            _id: order.user
        })
        const greenwebsms = new URLSearchParams();
        greenwebsms.append('token', process.env.SMS_TOKEN);
        greenwebsms.append('to', `+${user.phone}`);
        greenwebsms.append('message', `Your delivery status has been updated to Cancelled for nekmart order code ${order.orderId}`);
        axios.post('http://api.greenweb.com.bd/api.php', greenwebsms)
        return {
            success: true,
            message: "Order cancelled successfully!"
        }
    }

    //Cancel order by user
    async cancelByUser(cancelStatusInput: CancelStatusInput, reqUser: ReqUser): Promise<SuccessInfo> {
        const order = await this.orderModel.findOne({
            _id: cancelStatusInput.id,
            user: reqUser._id
        });
        if (!order) throw new NotFoundException("Order not found!");
        const seller = order.productInfo.find((item) => item.seller.toString() === cancelStatusInput.ownId.toString());
        if (!seller) throw new NotFoundException("Seller not found under this order!");
        if (seller.status === "Pending") {
            await this.orderModel.findOneAndUpdate({
                _id: cancelStatusInput.id,
                "productInfo.seller": cancelStatusInput.ownId
            }, {
                "$set": {
                    "productInfo.$.status": "Cancelled",
                    "productInfo.$.cancelBy": "User"
                }
            }, { new: true });
        } else {
            throw new NotFoundException("You can't cancel this order now!");
        }
        return {
            success: true,
            message: "Order cancelled successfully!"
        }
    }

    //Change order notes
    async note(note: string, id: ObjectId): Promise<SuccessInfo> {
        const result = await this.orderModel.findByIdAndUpdate(id, { note }, { new: true });
        if (!result) throw new NotFoundException("Order not found!");
        return {
            success: true,
            message: "Order note updated successfully!"
        }
    };

    //Delete Order
    async delete(id: ObjectId): Promise<SuccessInfo> {
        const result = await this.orderModel.findByIdAndDelete(id);
        if (!result) throw new NotFoundException("Order not found!");
        return {
            success: true,
            message: "Order deleted successfully!"
        }
    };

    //Get Orders by batch
    async findOrderByBatch(Ids: ObjectId[]): Promise<(Orders | Error)[]> {
        const orders = await this.orderModel.find({ _id: { $in: Ids } });
        const mappedResults = Ids.map(
            (id) =>
                orders.find((result) => result.id === id.toString())
        );
        return mappedResults;
    }
}