import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import omitEmpty from "omit-empty";

//Schema
import { Review, ReviewDocument } from "./model/reviews.schema";
import { Orders, OrderDocument } from "src/orders/model/orders.schema";
import { Seller, SellerDocument } from "src/seller/model/seller.schema";
import { Product, ProductDocument } from "src/product/model/product.schema";

//Entities
import { SuccessInfo } from "src/user/entities/success.entity";

//Dto
import { ReviewInput } from "./dto/review.dto";
import { CheckReviewInput } from "./dto/check.dto";
import { ReplyInput } from "./dto/reply.dto";

//Types
import { ReqUser } from "src/auth/types/user.types";

@Injectable()
export class ReviewService {
    //Constructor
    constructor(
        @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
        @InjectModel(Orders.name) private orderModel: Model<OrderDocument>,
        @InjectModel(Seller.name) private sellerModel: Model<SellerDocument>,
        @InjectModel(Product.name) private productModel: Model<ProductDocument>
    ) { };

    //Get Reviews by product
    async getReviews(productSlug: string) {
        const product = await this.productModel.findOne({
            slug: productSlug
        })
        const reviews = await this.reviewModel.find({
            product: product?._id
        });
        return reviews;
    };

    //Get Reviews by User
    async getReviewByUser(reqUser: ReqUser) {
        const reviews = await this.reviewModel.find({
            user: reqUser._id
        });
        return reviews;
    };

    //Get seller by user
    async getReviewBySeller(reqUser: ReqUser) {
        const seller = await this.sellerModel.findOne({
            user: reqUser._id
        });
        const reviews = await this.reviewModel.find({
            seller: seller._id,
            $or: [
                { reply: { $exists: false } },
                { reply: "" }
            ]
        });
        return reviews;
    }

    //Get reviews by admin
    async getReviewByAdmin() {
        const reviews = await this.reviewModel.find();
        return reviews;
    };

    //Add Reviews
    async add(reviewInput: ReviewInput, reqUser: ReqUser): Promise<SuccessInfo> {
        reviewInput = await omitEmpty(reviewInput) as ReviewInput;
        const reviews = await this.reviewModel.findOne({
            user: reqUser._id,
            product: reviewInput.product
        });
        if (reviews) throw new NotFoundException("You already place a review!");
        const order = await this.orderModel.findOne({
            "productInfo.seller": reviewInput.seller,
            "productInfo.products.productId": reviewInput.product
        });
        const seller = order.productInfo.find((item) => item.seller.toString() === reviewInput.seller.toString())
        if (seller.status !== "Delivered") throw new NotFoundException("You can't place a review now!");
        const hasProduct = seller.products.find((item) => item.productId.toString() === reviewInput.product.toString());
        if (!hasProduct) throw new NotFoundException("Product not found into your order!");
        await this.reviewModel.create({ ...reviewInput, user: reqUser._id });
        await this.sellerModel.findByIdAndUpdate(reviewInput.seller, {
            $inc: {
                reviews: 1,
                totalRatting: reviewInput.rate
            }
        })
        return {
            success: true,
            message: "Review added successfully!"
        }
    };

    //Reply review
    async reply(replyInput: ReplyInput) {
        const review = await this.reviewModel.findById(replyInput.reviewId);
        if (!review) throw new NotFoundException("Review not found!");
        if (review.reply) throw new NotFoundException("Reply already added!")
        await this.reviewModel.findByIdAndUpdate(replyInput.reviewId, {
            reply: replyInput.reply
        }, { new: true })
        return {
            success: true,
            message: "Reply added successfully!"
        }
    }

    //Check Review is available
    async check(checkReviewInput: CheckReviewInput, reqUser: ReqUser): Promise<SuccessInfo> {
        const product = await this.productModel.findOne({
            slug: checkReviewInput.product
        });
        if (!product) throw new NotFoundException("Product not found!");
        const reviews = await this.reviewModel.findOne({
            user: reqUser._id,
            product: product._id
        });
        if (reviews) return {
            success: false,
            message: "You can't place review!"
        }
        const order = await this.orderModel.findOne({
            "productInfo.seller": checkReviewInput.seller,
            "productInfo.products.productId": product._id
        });
        if (!order) throw new NotFoundException("Order not found!");
        const seller = order.productInfo.find((item) => item.seller.toString() === checkReviewInput.seller.toString())
        if (seller.status !== "Delivered") throw new NotFoundException("You can't place a review now!");
        const hasProduct = seller.products.find((item) => item.productId.toString() === product._id.toString());
        if (!hasProduct) return {
            success: false,
            message: "You can't place review!"
        }
        return {
            success: true,
            message: "You can place review!"
        }
    };
}