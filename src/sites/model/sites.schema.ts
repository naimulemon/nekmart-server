import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type SiteDocument = Site & Document;

@Schema({ _id: false })
class Seo {
    @Prop({ type: String })
    metaTitle: string;
    @Prop({ type: String })
    metaDescription: string;
    @Prop({ type: [{ type: String }] })
    metaTag: string[];
    @Prop({ type: String })
    siteUrl: string;
    @Prop({ type: String })
    ogTitle: string;
    @Prop({ type: String })
    ogDescription: string;
    @Prop({ type: String })
    ogImage: string;
}

const SeoSchema = SchemaFactory.createForClass(Seo);

@Schema({ _id: false })
class Additional {
    @Prop({ type: String })
    email: string;
    @Prop({ type: String })
    phone: string;
    @Prop({ type: String })
    corporateOffice: string;
    @Prop({ type: String })
    headOffice: string;
}

const AdditionalSchema = SchemaFactory.createForClass(Additional);

@Schema({ _id: false })
class Social {
    @Prop({ type: String })
    facebook: string;
    @Prop({ type: String })
    instagram: string;
    @Prop({ type: String })
    youtube: string;
    @Prop({ type: String })
    twitter: string;
    @Prop({ type: String })
    linkedIn: string;
}

const SocialSchema = SchemaFactory.createForClass(Social);

@Schema({ timestamps: true })
export class Site {
    @Prop({ type: String })
    logo: string;
    @Prop({ type: String })
    icon: string;
    @Prop({ type: String })
    siteTitle: string;
    @Prop({ type: String })
    slogan: string;
    @Prop({ type: SeoSchema })
    seo: Seo;
    @Prop({ type: AdditionalSchema })
    additionInfo: Additional;
    @Prop({ type: SocialSchema })
    social: Social;
}

export const SiteSchema = SchemaFactory.createForClass(Site);