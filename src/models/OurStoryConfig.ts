import mongoose, { Schema, Document } from 'mongoose';

export interface IOurStoryConfig extends Document<string> {
  _id: string;
  hero: {
    imageId: string;
    eyebrow: string;
    scriptTitle: string;
    title: string;
    typography?: {
      titleFont?: 'h-display' | 'font-sans' | 'font-script';
      subtitleFont?: 'h-display' | 'font-sans' | 'font-script';
      eyebrowFont?: 'h-display' | 'font-sans' | 'font-script';
      hideEyebrowOnMobile?: boolean;
    };
    isVisible: boolean;
    textColor: string;
    bgColor: string;
  };
  timeline: {
    chapters: {
      year: string;
      title: string;
      detail: string;
      imageId: string;
    }[];
    typography?: {
      titleFont?: 'h-display' | 'font-sans' | 'font-script';
      subtitleFont?: 'h-display' | 'font-sans' | 'font-script';
      eyebrowFont?: 'h-display' | 'font-sans' | 'font-script';
      hideEyebrowOnMobile?: boolean;
    };
    isVisible: boolean;
    textColor: string;
    bgColor: string;
  };
  cta: {
    eyebrow: string;
    title: string;
    buttonLabel: string;
    buttonLink: string;
    typography?: {
      titleFont?: 'h-display' | 'font-sans' | 'font-script';
      subtitleFont?: 'h-display' | 'font-sans' | 'font-script';
      eyebrowFont?: 'h-display' | 'font-sans' | 'font-script';
      hideEyebrowOnMobile?: boolean;
    };
    isVisible: boolean;
    textColor: string;
    bgColor: string;
  };
}

const OurStoryConfigSchema = new Schema({
  _id: { type: String, default: "our-story" },
  hero: {
    imageId: { type: String, default: "" },
    eyebrow: { type: String, default: "Our Story" },
    scriptTitle: { type: String, default: "since 2016" },
    title: { type: String, default: "Every love story deserves a storyteller" },
    typography: {
      titleFont: { type: String, enum: ["h-display", "font-sans", "font-script"] },
      subtitleFont: { type: String, enum: ["h-display", "font-sans", "font-script"] },
      eyebrowFont: { type: String, enum: ["h-display", "font-sans", "font-script"] },
      hideEyebrowOnMobile: { type: Boolean },
    },
    isVisible: { type: Boolean, default: true },
    textColor: { type: String, default: "" },
    bgColor: { type: String, default: "" },
  },
  timeline: {
    chapters: {
      type: [{ year: String, title: String, detail: String, imageId: String }],
      default: [
        { year: "2016", title: "A camera and a conviction", detail: "Garima Dhingra photographs her first wedding — and realises that what she is capturing is not events, but heirlooms.", imageId: "" },
        { year: "2018", title: "The studio opens its doors", detail: "Certified in newborn photography, Garima expands into maternity, newborn and family portraiture.", imageId: "" },
        { year: "2020", title: "Films join the frame", detail: "A cinematography wing brings weddings to life in motion.", imageId: "" },
        { year: "2022", title: "Design becomes destiny", detail: "The decor and planning studios launch. The Eternal Bliss becomes a full experience house.", imageId: "" },
        { year: "Today", title: "Destinations without limits", detail: "From Udaipur's palaces to Goa's shores and beyond India's borders — 450+ celebrations later.", imageId: "" },
      ]
    },
    typography: {
      titleFont: { type: String, enum: ["h-display", "font-sans", "font-script"] },
      subtitleFont: { type: String, enum: ["h-display", "font-sans", "font-script"] },
      eyebrowFont: { type: String, enum: ["h-display", "font-sans", "font-script"] },
      hideEyebrowOnMobile: { type: Boolean },
    },
    isVisible: { type: Boolean, default: true },
    textColor: { type: String, default: "" },
    bgColor: { type: String, default: "" },
  },
  cta: {
    eyebrow: { type: String, default: "The Next Chapter" },
    title: { type: String, default: "Perhaps it begins with you" },
    buttonLabel: { type: String, default: "Write It With Us" },
    buttonLink: { type: String, default: "/contact" },
    typography: {
      titleFont: { type: String, enum: ["h-display", "font-sans", "font-script"] },
      subtitleFont: { type: String, enum: ["h-display", "font-sans", "font-script"] },
      eyebrowFont: { type: String, enum: ["h-display", "font-sans", "font-script"] },
      hideEyebrowOnMobile: { type: Boolean },
    },
    isVisible: { type: Boolean, default: true },
    textColor: { type: String, default: "" },
    bgColor: { type: String, default: "" },
  },
}, { timestamps: true });

export default mongoose.models.OurStoryConfig || mongoose.model<IOurStoryConfig>('OurStoryConfig', OurStoryConfigSchema);
