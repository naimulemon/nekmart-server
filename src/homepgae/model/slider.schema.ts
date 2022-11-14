import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type SliderDocument = Slider & Document;

@Schema({ timestamps: true })
export class Slider {
    @Prop({ type: String, required: true })
    name: string;
    @Prop({ type: String, required: true })
    url: string;
    @Prop({ type: String, required: true })
    slider: string;
}

export const SliderSchema = SchemaFactory.createForClass(Slider);