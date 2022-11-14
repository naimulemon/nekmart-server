import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as Schemas } from "mongoose";

//Schema
import { User } from "src/user/model/user.schema";
import { Orders } from "src/orders/model/orders.schema";

export type PointDocument = Points & Document;

@Schema({ timestamps: true })
export class Points {
    @Prop({ type: Number, required: true })
    points: number;
    @Prop({ type: Schemas.Types.ObjectId, required: true })
    user: User;
    @Prop({ type: Schemas.Types.ObjectId, required: true })
    order: Orders;
}

export const PointsSchema = SchemaFactory.createForClass(Points);