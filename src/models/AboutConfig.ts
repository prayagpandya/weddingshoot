import mongoose, { Schema, Document } from 'mongoose';

export interface IAboutConfig extends Document<string> {
  _id: string;
  hero: {
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
  founder: {
    imageId: string;
    eyebrow: string;
    scriptTitle: string;
    title: string;
    bullets: string[];
    content: string;
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
  stats: {
    items: { n: string; label: string }[];
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
  philosophy: {
    eyebrow: string;
    title: string;
    values: { title: string; detail: string }[];
    mission: string;
    vision: string;
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
  testimonials: {
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
    imageId: string;
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

const AboutConfigSchema = new Schema({
  _id: { type: String, default: "about" },
  hero: {
    eyebrow: { type: String, default: "About The Eternal Bliss" },
    scriptTitle: { type: String, default: "more than photography" },
    title: { type: String, default: "A complete luxury wedding experience house" },
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
  founder: {
    imageId: { type: String, default: "" },
    eyebrow: { type: String, default: "The Founder" },
    scriptTitle: { type: String, default: "Garima Dhingra" },
    title: { type: String, default: "The woman behind the bliss" },
    bullets: { type: [String], default: [
      "— Wedding Experience Curator",
      "— Certified Newborn Photographer",
      "— Luxury Wedding Planner",
      "— Decor Specialist"
    ]},
    content: { type: String, default: "Since 2016, Garima has led The Eternal Bliss with a singular philosophy: curate emotions, preserve memories, and transform celebrations into timeless experiences. Under her direction, a photography studio grew into one of India's most complete wedding experience houses — planning, decor, films, invitations, entertainment and fine-art photography under one roof." },
    buttonLabel: { type: String, default: "Read Our Story" },
    buttonLink: { type: String, default: "/our-story" },
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
  stats: {
    items: { type: [{ n: String, label: String }], default: [
      { n: "2016", label: "Founded" },
      { n: "450+", label: "Celebrations" },
      { n: "30+", label: "Destinations" },
      { n: "1", label: "Promise: Perfection" }
    ]},
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
  philosophy: {
    eyebrow: { type: String, default: "Philosophy" },
    title: { type: String, default: "What we believe" },
    values: { type: [{ title: String, detail: String }], default: [
      { title: "Curate Emotions", detail: "Every celebration is designed around the people in it — their rituals, their humour, their tears of joy." },
      { title: "Preserve Memories", detail: "Photographs, films and albums crafted as heirlooms — made to be held by generations that follow." },
      { title: "Transform Celebrations", detail: "Planning, decor and production woven into a single, seamless, timeless experience." }
    ]},
    mission: { type: String, default: "Deliver complete wedding experiences through planning, storytelling, photography, decor, films and flawless execution." },
    vision: { type: String, default: "Become one of India's leading luxury wedding experience companies." },
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
  testimonials: {
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
    imageId: { type: String, default: "" },
    title: { type: String, default: "Come, be part of our story" },
    buttonLabel: { type: String, default: "Start a Conversation" },
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

export default mongoose.models.AboutConfig || mongoose.model<IAboutConfig>('AboutConfig', AboutConfigSchema);
