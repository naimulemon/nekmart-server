import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as Schemas } from "mongoose";

//User Schema
import { User } from "src/user/model/user.schema";

export type AddressDocument = Address & Document;

@Schema({ timestamps: true })
export class Address {
    @Prop({ type: String, required: true })
    name: string;
    @Prop({ type: String, required: true })
    phone: string;
    @Prop({ type: String, enum: ["male", "female", "other"] })
    gender: string;
    @Prop({ type: String, required: true })
    address: string;
    @Prop({ type: String, required: true })
    country: string;
    @Prop({ type: String, required: true })
    city: string;
    @Prop({ type: String, required: true })
    area: string;
    @Prop({ type: String })
    postal: string;
    @Prop({ type: Boolean })
    default: string;
    @Prop({ type: Schemas.Types.ObjectId, ref: "User", required: true })
    user: User
}

export const AddressSchema = SchemaFactory.createForClass(Address);