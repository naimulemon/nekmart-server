import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as Schemas } from "mongoose";

//Seller
import { Seller } from "src/seller/model/seller.schema";

export type WithdrawDocument = Withdraw & Document;

@Schema({ timestamps: true })
export class Withdraw {
    @Prop({ type: Schemas.Types.ObjectId, ref: "Seller", required: true })
    seller: Seller;
    @Prop({ type: Number, required: true })
    amount: number;
    @Prop({ type: String, required: true })
    releasedBy: string;
    @Prop({ type: String, required: true })
    method: string;
    @Prop({ type: String, enum: ["Processing", "Confirmed"], default: "Processing" })
    status: string;
}

export const WithdrawSchema = SchemaFactory.createForClass(Withdraw);

