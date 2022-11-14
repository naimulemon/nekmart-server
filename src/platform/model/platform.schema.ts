import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type PlatformDocument = Document & Platform;

@Schema({ timestamps: true })
export class Platform {
    @Prop({ type: Number })
    charge: number;
}

export const PlatformSchema = SchemaFactory.createForClass(Platform);