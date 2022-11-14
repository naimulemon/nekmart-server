import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type AttributeDocument = Attribute & Document;

@Schema({ _id: false })
class Values {
    @Prop({ type: String, required: true })
    value: string;
    @Prop({ type: String })
    meta: string;
}

const ValuesSchema = SchemaFactory.createForClass(Values);

@Schema({ timestamps: true })
export class Attribute {
    @Prop({ type: String, required: true })
    name: string;
    @Prop({ type: String, slug: "name", unique: true, slugPaddingSize: 1 })
    slug: string;
    @Prop({ type: [ValuesSchema] })
    values: Values[];
}

export const AttributeSchema = SchemaFactory.createForClass(Attribute);