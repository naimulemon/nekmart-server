import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

//Schemas
import { Product, ProductDocument } from "src/product/model/product.schema";
import { User, UserDocument } from "src/user/model/user.schema";
import { Orders, OrderDocument } from "src/orders/model/orders.schema";
import { Cart, CartDocument } from "src/cart/model/cart.schema";
import { Wishlist, WishlistDocument } from "src/wishlist/model/wishlist.schema";
import { Address, AddressDocument } from "src/address/model/address.schema";
import { Income, IncomeDocument } from "src/seller/model/income.schema";
import { Seller, SellerDocument } from "src/seller/model/seller.schema";
import { Withdraw, WithdrawDocument } from "src/withdraw/model/withdraw.schema";
import { Flash, FlashDocument } from "src/flash/model/flash.schema";

//Types
import { ReqUser } from "src/auth/types/user.types";

@Injectable()
export class AnalyticsService {
    //Constructor
    constructor(
        @InjectModel(Product.name) private productModel: Model<ProductDocument>,
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(Orders.name) private orderModel: Model<OrderDocument>,
        @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
        @InjectModel(Wishlist.name) private wishlistModel: Model<WishlistDocument>,
        @InjectModel(Address.name) private addressModel: Model<AddressDocument>,
        @InjectModel(Income.name) private incomeModel: Model<IncomeDocument>,
        @InjectModel(Seller.name) private sellerModel: Model<SellerDocument>,
        @InjectModel(Withdraw.name) private withdrawModel: Model<WithdrawDocument>,
        @InjectModel(Flash.name) private flashModel: Model<FlashDocument>
    ) { }

    //Get analytics for admin dashboard
    async admin() {
        const totalProduct = await this.productModel.countDocuments();
        const totalSeller = await this.sellerModel.countDocuments();
        const totalOrder = await this.orderModel.countDocuments();
        const successfulOrder = await this.orderModel.countDocuments({
            "productInfo.status": "Delivered"
        })
        const pendingOrder = await this.orderModel.countDocuments({
            "productInfo.status": "Pending"
        })
        const pendingProducts = await this.productModel.countDocuments({
            approved: false,
            visibility: true
        })
        const pendingSeller = await this.sellerModel.countDocuments({
            verified: false
        })
        const totalUser = await this.userModel.countDocuments({
            phone: {
                $ne: "8801611994403"
            }
        });
        const cancelledOrder = await this.orderModel.countDocuments({
            "productInfo.status": "Cancelled"
        })
        return {
            totalProduct,
            totalSeller,
            totalOrder,
            successfulOrder,
            pendingOrder,
            pendingProducts,
            pendingSeller,
            totalUser,
            cancelledOrder
        }
    }

    //Get analytics for seller dashboard
    async seller(reqUser: ReqUser) {
        const seller = await this.sellerModel.findOne({
            user: reqUser._id
        })
        const totalProduct = await this.productModel.countDocuments({
            seller: seller._id
        });
        const totalSale = await this.orderModel.countDocuments({
            "productInfo.seller": seller._id
        })
        const income = await this.incomeModel.find({
            seller: seller._id
        });
        const totalSaleMoney = income.reduce((a, b) => +a + +b.income, 0)
        const successfulOrder = income.length
        let date = new Date();
        date = new Date(date.setDate(date.getDate() - 7));
        const incomeCurrent = await this.incomeModel.find({
            createdAt: {
                $lt: date
            },
            seller: seller._id,
            paySuccess: false,
            refunded: {
                $nin: ["Approved", "Pending"]
            }
        });
        const currentIncome = incomeCurrent.reduce((acc, item) => item.income + acc, 0);
        const incomeUpcoming = await this.incomeModel.find({
            createdAt: {
                $gt: date
            },
            seller: seller._id,
            paySuccess: false,
            refunded: {
                $nin: ["Approved"]
            }
        });
        const upcomingWithdraw = incomeUpcoming.reduce((acc, item) => item.income + acc, 0);
        const withdraw = await this.withdrawModel.find({
            $expr: {
                $eq: [
                    1,
                    {
                        "$dateDiff": {
                            "startDate": "$createdAt",
                            "endDate": "$$NOW",
                            "unit": "month"
                        }
                    }
                ]
            }
        })
        const lastMonthIncome = withdraw.reduce((acc, item) => item.amount + acc, 0);
        const totalRatting = seller.totalRatting / seller.reviews;
        const pendingWithdraw = await this.withdrawModel.countDocuments({
            status: "Processing",
            seller: seller._id
        });
        const runningCampaign = await this.flashModel.countDocuments({
            start: {
                $lte: Date.now()
            },
            expires: {
                $gte: Date.now()
            }
        });
        const cancelledOrder = await this.orderModel.countDocuments({
            "productInfo.seller": seller._id,
            "productInfo.status": "Cancelled"
        })
        return {
            totalProduct: totalProduct || 0,
            totalSale: totalSale || 0,
            totalSaleMoney: totalSaleMoney || 0,
            successfulOrder: successfulOrder || 0,
            currentIncome: currentIncome || 0,
            upcomingWithdraw: upcomingWithdraw || 0,
            lastMonthIncome: lastMonthIncome || 0,
            totalRatting: totalRatting || 0,
            pendingWithdraw: pendingWithdraw || 0,
            runningCampaign: runningCampaign || 0,
            cancelledOrder: cancelledOrder || 0
        }
    }

    //Get analytics for user dashboard
    async user(reqUser: ReqUser) {
        const totalCart = await this.cartModel.countDocuments({
            user: reqUser._id
        });
        const totalWishlist = await this.wishlistModel.countDocuments({
            user: reqUser._id
        });
        const totalOrder = await this.orderModel.countDocuments({
            user: reqUser._id
        });
        const defaultAddress = await this.addressModel.findOne({
            user: reqUser._id,
            default: true
        })
        return {
            totalCart,
            totalWishlist,
            totalOrder,
            defaultAddress
        }
    }
}