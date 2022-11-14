import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, ObjectId } from "mongoose";
import omitEmpty from "omit-empty";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

//StringBase
import { stringToBase64 } from "src/helpers/base";

//Schema
import { Seller, SellerDocument } from "./model/seller.schema";
import { Income, IncomeDocument } from "./model/income.schema";
import { Product, ProductDocument } from "src/product/model/product.schema";
import { User, UserDocument } from "src/user/model/user.schema";

//Entities
import { SuccessInfo } from "src/user/entities/success.entity";

//Dto
import { SellerInput } from "./dto/seller.dto";
import { UpdateSellerInput } from "./dto/update.dto";
import { SellerPrams } from "./dto/get-seller.dto";
import { BankInformationInput } from "./dto/bank.dto";
import { LoginInput } from "src/user/dto/login.dto";

//Types
import { ReqUser } from "src/auth/types/user.types";


@Injectable()
export class SellerService {
    //Constructor
    constructor(
        @InjectModel(Seller.name) private sellerModel: Model<SellerDocument>,
        @InjectModel(Income.name) private incomeModel: Model<IncomeDocument>,
        @InjectModel(Product.name) private productModel: Model<ProductDocument>,
        @InjectModel(User.name) private userModel: Model<UserDocument>
    ) { }

    //Get Sellers (by user)
    async gets(sellerPrams: SellerPrams) {
        const skip = parseFloat(sellerPrams.limit) * (parseFloat(sellerPrams.skip) - 1);
        let args = {};
        for (let key in sellerPrams) {
            if (sellerPrams[key].length > 0) {
                if (key === "search") {
                    args["name"] = {
                        $regex: new RegExp(sellerPrams['search'].replace(/[-[\]{}()*+?.,\\/^$|#\s]/g, "\\$&")),
                        $options: 'i'
                    }
                }
            }
        }
        args["verified"] = true;
        args["banned"] = false;
        args["hidden"] = false;
        const count = await this.sellerModel.countDocuments(args);
        let sellers = await this.sellerModel.find(args)
            .limit(parseFloat(sellerPrams.limit) + 1)
            .skip(skip)
        const hasNextPage = sellers.length > parseFloat(sellerPrams.limit);
        sellers = hasNextPage ? sellers.slice(0, -1) : sellers;
        return {
            success: true,
            sellers,
            pageInfos: {
                hasNextPage,
                count
            }
        }
    }

    //Get sellers by admin
    async getsByAdmin(sellerPrams: SellerPrams) {
        const skip = parseFloat(sellerPrams.limit) * (parseFloat(sellerPrams.skip) - 1);
        let args = {};
        for (let key in sellerPrams) {
            if (sellerPrams[key].length > 0) {
                if (key === "search") {
                    args["name"] = {
                        $regex: new RegExp(sellerPrams['search'].replace(/[-[\]{}()*+?.,\\/^$|#\s]/g, "\\$&")),
                        $options: 'i'
                    }
                }
            }
        }
        args["hidden"] = false;
        const count = await this.sellerModel.countDocuments(args);
        let sellers = await this.sellerModel.find(args)
            .limit(parseFloat(sellerPrams.limit) + 1)
            .skip(skip)
            .sort({ lastPaymentDate: -1 })
        const hasNextPage = sellers.length > parseFloat(sellerPrams.limit);
        sellers = hasNextPage ? sellers.slice(0, -1) : sellers;
        return {
            success: true,
            sellers,
            pageInfos: {
                hasNextPage,
                count
            }
        }
    }

    //Get seller by user
    async getByUser(slug: string) {
        const seller = await this.sellerModel.findOne({
            slug: slug,
            banned: false,
            verified: true,
            hidden: false
        });
        if (!seller) throw new NotFoundException("Seller information not found!");
        return seller;
    }

    //Get seller by admin
    async getByAdmin(slug: string) {
        const seller = await this.sellerModel.findOne({
            slug: slug,
            hidden: false
        })
        if (!seller) throw new NotFoundException("Seller information not found!");
        return seller;
    }

    //Get seller own
    async getSellerOwn(reqUser: ReqUser) {
        const seller = await this.sellerModel.findOne({
            user: reqUser._id,
            hidden: false
        });
        console.log(reqUser);
        if (!seller) throw new NotFoundException("Seller not found!");
        return seller;
    }

    //Get income history
    async getIncome(reqUser: ReqUser) {
        const seller = await this.sellerModel.findOne({
            user: reqUser._id
        });
        const incomes = await this.incomeModel.find({
            seller: seller._id
        });
        return incomes
    }

    //Get order history for refund
    async getRefund(reqUser: ReqUser) {
        const income = await this.incomeModel.find({
            user: reqUser._id
        });
        return income;
    }

    //Create seller
    async create(sellerInput: SellerInput, reqUser: ReqUser): Promise<SuccessInfo> {
        const seller = await this.sellerModel.findOne({
            $or: [{
                user: reqUser._id,
            }, {
                shopName: sellerInput.shopName
            }]
        });
        if (seller) throw new NotFoundException("Shop name already registered! Please choose different shop name.")
        await this.sellerModel.create({ ...sellerInput, user: reqUser._id })
        return {
            success: true,
            message: "Seller registration successful!"
        }
    }

    //Update seller
    async update(id: ObjectId, updateSellerInput: UpdateSellerInput): Promise<SuccessInfo> {
        updateSellerInput = await omitEmpty(updateSellerInput) as UpdateSellerInput;
        const seller = await this.sellerModel.findById(id);
        if (seller.banned) throw new NotFoundException("You are restricted!")
        if (!seller) throw new NotFoundException("Seller not found!");
        if (seller.shopName !== updateSellerInput.shopName) {
            const hasSeller = await this.sellerModel.findOne({
                shopName: updateSellerInput.shopName
            });
            if (hasSeller) throw new NotFoundException("Please choose different shop name!");
        }
        await this.sellerModel.findByIdAndUpdate(seller._id, updateSellerInput, { new: true })
        return {
            success: true,
            message: "Your information updated successfully!"
        }
    }

    //Close seller
    async close(reqUser: ReqUser): Promise<SuccessInfo> {
        const seller = await this.sellerModel.findOne({
            user: reqUser._id
        });
        if (!seller) throw new NotFoundException("Seller information not found!");
        if (seller.banned || seller.hidden) throw new NotFoundException("You are restricted!");
        const updated = await this.sellerModel.findOneAndUpdate({
            user: reqUser._id
        }, { hidden: true }, { new: true })
        if (!updated) throw new NotFoundException("Seller information not found!");
        await this.productModel.updateMany({
            seller: updated._id
        }, {
            visibility: false
        }, { new: true })
        return {
            success: true,
            message: "Your shop closed permanently!"
        }
    }

    //Banned seller
    async banned(id: ObjectId): Promise<SuccessInfo> {
        const updated = await this.sellerModel.findByIdAndUpdate(id, {
            banned: true
        }, { new: true })
        if (!updated) throw new NotFoundException("Seller information not found!");
        await this.productModel.updateMany({
            seller: id
        }, {
            visibility: false
        })
        return {
            success: true,
            message: "Seller banned successfully!"
        }
    }

    //Unbanned seller
    async unbanned(id: ObjectId): Promise<SuccessInfo> {
        const updated = await this.sellerModel.findByIdAndUpdate(id, {
            banned: false
        }, { new: true })
        if (!updated) throw new NotFoundException("Seller information not found!");
        await this.productModel.updateMany({
            seller: id
        }, {
            visibility: true
        }, { new: true })
        return {
            success: true,
            message: "Seller banned successfully!"
        }
    }

    //Seller verification
    async verify(id: ObjectId): Promise<SuccessInfo> {
        const updated = await this.sellerModel.findByIdAndUpdate(id, {
            verified: true
        }, { new: true })
        if (!updated) throw new NotFoundException("Seller information not found!");
        await this.userModel.findByIdAndUpdate(updated.user, {
            role: "seller"
        }, { new: true })
        return {
            success: true,
            message: "Seller verified successfully!"
        }
    }

    //Add bank information
    async bank(bankInformationInput: BankInformationInput, reqUser: ReqUser) {
        const result = await this.sellerModel.findOneAndUpdate({
            user: reqUser._id
        }, {
            bankInformation: bankInformationInput
        }, { new: true })
        if (!result) throw new NotFoundException("Seller not found");
        return {
            success: true,
            message: "Bank information added successfully!"
        }
    }

    //Seller Login
    async login(loginInput: LoginInput) {
        const user = await this.userModel.findOne({
            $or: [{
                phone: loginInput.phoneOrEmail
            }, {
                email: loginInput.phoneOrEmail
            }]
        }).select("+password");
        if (!user) throw new NotFoundException("Wrong email or password!");
        const seller = await this.sellerModel.findOne({
            user: user._id
        });
        if (!seller) throw new NotFoundException("Seller not found! Please register!")
        const verifyPass = await bcrypt.compare(loginInput.password, user.password);
        if (!verifyPass) throw new NotFoundException("Wrong email or password!");
        const token = jwt.sign({
            info: stringToBase64(user.phone)
        }, process.env.JWT_SECRET_KEY, { expiresIn: "30d" });
        let expire: any = new Date();
        expire.setDate(expire.getDate() + 30);
        return {
            success: true,
            message: "User login successfully!",
            token,
            expire
        }
    }

    //Get seller by batch query
    async findSellerByBatch(Ids: ObjectId[]): Promise<(Seller | Error)[]> {
        const sellers = await this.sellerModel.find({ _id: { $in: Ids } });
        const mappedResults = Ids.map(
            (id) =>
                sellers.find((result) => result.id === id.toString())
        )
        return mappedResults;
    }
}