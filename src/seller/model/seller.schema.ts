import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as Schemas } from "mongoose";

//Schema
import { User } from "src/user/model/user.schema";

export type SellerDocument = Seller & Document;


@Schema({ _id: false })
class BankInformation {
    @Prop({ type: String })
    name: string;
    @Prop({ type: String })
    accNumber: string;
    @Prop({ type: String })
    routing: string;
    @Prop({ type: String })
    bankName: string;
    @Prop({ type: String })
    branch: string;
}

const BankInformationSchema = SchemaFactory.createForClass(BankInformation);

@Schema({ timestamps: true })
export class Seller {
    @Prop({ type: Schemas.Types.ObjectId, ref: "User", required: true })
    user: User;
    @Prop({ type: String, required: true })
    shopName: string;
    @Prop({ type: String, slug: "shopName", unique: true, slugPaddingSize: 1 })
    slug: string;
    @Prop({ type: String, required: true })
    phone: string;
    @Prop({ type: String })
    logo: string;
    @Prop({ type: String })
    banner: string;
    @Prop({ type: String })
    address: string;
    @Prop({ type: String })
    metaTitle: string;
    @Prop({ type: String })
    metaDescription: string;
    @Prop({ type: Boolean, default: false })
    verified: boolean;
    @Prop({ type: Boolean, default: false })
    banned: boolean;
    @Prop({ type: Boolean, default: false })
    hidden: boolean;
    @Prop({ type: BankInformationSchema })
    bankInformation: BankInformation;
    @Prop({ type: Number, default: 0 })
    reviews: number;
    @Prop({ type: Number, default: 0 })
    totalRatting: number;
    @Prop({ type: Date })
    lastPaymentDate: Date
}

export const SellerSchema = SchemaFactory.createForClass(Seller);