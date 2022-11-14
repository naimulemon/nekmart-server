import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type PreorderDocument = Preorder & Document;

@Schema({ _id: false })
class PreorderUrl {
    @Prop({ type: String })
    url: string;
}

const PreorderUrlSchema = SchemaFactory.createForClass(PreorderUrl);

@Schema({ timestamps: true })
export class Preorder {
    @Prop({ type: String, required: true })
    firstName: string;
    @Prop({ type: String, required: true })
    lastName: string;
    @Prop({ type: String, required: true })
    phone: string;
    @Prop({ type: String, required: true })
    address: string;
    @Prop({ type: String })
    email: string;
    @Prop({ type: [{ type: PreorderUrlSchema }] })
    productImage: PreorderUrl[];
    @Prop({ type: [{ type: PreorderUrlSchema }] })
    productUrl: PreorderUrl[];
    @Prop({ type: String })
    note: string;
}

export const PreorderSchema = SchemaFactory.createForClass(Preorder);