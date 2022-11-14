import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, ObjectId } from "mongoose";
import omitEmpty from "omit-empty";

//Schema
import { Cart, CartDocument } from "./model/cart.schema";
import { Product, ProductDocument } from "src/product/model/product.schema";

//Dto
import { CartInput } from "./dto/cart.dto";

//Entities
import { SuccessInfo } from "src/user/entities/success.entity";
import { IncreaseInfo } from "./entities/increase.entity";

//Types
import { ReqUser } from "src/auth/types/user.types";

@Injectable()
export class CartService {
    //Constructor
    constructor(
        @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
        @InjectModel(Product.name) private productModel: Model<ProductDocument>
    ) { };

    //Get Carts
    async get(reqUser: ReqUser) {
        const carts = await this.cartModel.find({
            user: reqUser._id
        });
        return carts;
    };

    //Has cart
    async has(reqUser: ReqUser) {
        const has = await this.cartModel.find({
            user: reqUser._id
        });
        return {
            success: has.length > 0 ? true : false,
            message: has.length > 0 ? "You can access" : "You can't access"
        }
    }
    //Add cart
    async add(cartInput: CartInput, reqUser: ReqUser): Promise<SuccessInfo> {
        cartInput = await omitEmpty(cartInput) as CartInput;
        const cart = await this.cartModel.findOne({
            product: cartInput.product,
            user: reqUser._id
        });
        const product = await this.productModel.findById(cartInput.product);
        if (!cart) {
            await this.cartModel.create({ ...cartInput, user: reqUser._id });
        } else {
            if (product.quantity <= (cart.quantity + cartInput.quantity)) throw new NotFoundException("Stock limited!");
            cart.quantity = cart.quantity + cartInput.quantity
            cart.amount = cart.amount + cartInput.amount
            await cart.save();
        }
        return {
            success: true,
            message: "Product added to cart successfully!"
        }
    };

    //Increase Cart Quantity
    async increase(id: ObjectId, reqUser: ReqUser): Promise<IncreaseInfo> {
        const quantity = await this.cartModel.findOne({
            _id: id,
            user: reqUser._id
        });
        if (!quantity) throw new NotFoundException("Cart not found!");
        const product = await this.productModel.findOne({
            _id: quantity.product
        });
        if (quantity.quantity < product.quantity) {
            const result = await this.cartModel.findOneAndUpdate({
                _id: id,
                user: reqUser._id
            }, {
                $inc: {
                    quantity: 1,
                    amount: quantity.amount / quantity.quantity
                }
            });
            if (!result) throw new NotFoundException("Cart not found!");
        }
        return {
            success: true,
            hasMore: quantity.quantity < product.quantity - 1,
            message: "Cart updated successfully!"
        }
    };

    //Decrease Cart Quantity
    async decrease(id: ObjectId, reqUser: ReqUser): Promise<SuccessInfo> {
        const quantity = await this.cartModel.findOne({
            _id: id,
            user: reqUser._id
        });
        const result = await this.cartModel.findOneAndUpdate({
            _id: id,
            user: reqUser._id,
            quantity: {
                $gte: 2
            }
        }, {
            $inc: {
                quantity: -1,
                amount: -(quantity.amount / quantity.quantity)
            }
        });
        if (!result) throw new NotFoundException("Cart quantity minimum value is 1!");
        return {
            success: true,
            message: "Cart updated successfully!"
        }
    };

    //Delete Cart
    async delete(id: ObjectId, reqUser: ReqUser): Promise<SuccessInfo> {
        const result = await this.cartModel.findOneAndDelete({
            _id: id,
            user: reqUser._id
        });
        if (!result) throw new NotFoundException("Cart not found!");
        return {
            success: true,
            message: "Cart deleted successfully!"
        }
    }
}