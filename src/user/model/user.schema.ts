import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type UserDocument = User & Document;

@Schema({ _id: false })
class Provider extends Document {
    @Prop({ type: String })
    name: string;
    @Prop({ type: String })
    id: string;
}
const ProviderSchema = SchemaFactory.createForClass(Provider);

@Schema({ timestamps: true })
export class User extends Document {
    @Prop({ type: String })
    name: string;
    @Prop({ type: String })
    phone: string;
    @Prop({ type: String })
    email: string;
    @Prop({ type: String })
    avatar: string;
    @Prop({ type: String, select: false })
    password: string;
    @Prop({ type: String, select: false })
    otp: string;
    @Prop({ type: Boolean, default: false, required: true })
    verified: boolean;
    @Prop({ type: ProviderSchema })
    provider: Provider;
    @Prop({ type: Number })
    points: number;
    @Prop({ type: String, enum: ["user", "editor", "moderator", "admin"], default: "user" })
    role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ createdAt: 1 }, {
    expireAfterSeconds: 300,
    partialFilterExpression: {
        verified: false
    }
});