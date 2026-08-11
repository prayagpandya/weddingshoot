import mongoose, { Schema, Document } from 'mongoose';

export interface IHomeConfig extends Document<string> {
  _id: string;
  hero: {
    subtitle: string;
    title: string;
    titleHighlight: string;
    imageIds: string[];
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
  explore: {
    layout: 'carousel' | 'grid';
    cardShape: 'portrait' | 'square' | 'landscape' | 'circle';
    spacing: 'small' | 'medium' | 'large';
    items: {
      label: string;
      href: string;
      imageId: string;
      orientation?: 'vertical' | 'horizontal' | 'auto';
      galleryImageIds?: string[];
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
  gallery: {
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
  stories: {
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

const HomeConfigSchema = new Schema({
  _id: { type: String, default: "home" }, // singleton
  hero: {
    subtitle: { type: String, default: "Creating timeless memories" },
    title: { type: String, default: "Where every celebration becomes" },
    titleHighlight: { type: String, default: "\"Eternal\"" },
    imageIds: [{ type: String }],
    typography: {
      titleFont: { type: String, enum: ["h-display", "font-sans", "font-script"] },
      subtitleFont: { type: String, enum: ["h-display", "font-sans", "font-script"] },
      eyebrowFont: { type: String, enum: ["h-display", "font-sans", "font-script"] },
      hideEyebrowOnMobile: { type: Boolean },
    },
    isVisible: { type: Boolean, default: true },
    textColor: { type: String, default: "" }, // empty string means inherit theme
    bgColor: { type: String, default: "" },
  },
  explore: {
    layout: { type: String, enum: ["carousel", "grid"], default: "carousel" },
    cardShape: { type: String, enum: ["portrait", "square", "landscape", "circle"], default: "portrait" },
    spacing: { type: String, enum: ["small", "medium", "large"], default: "medium" },
    items: [{
      label: String,
      href: String,
      imageId: String,
      orientation: { type: String, enum: ["vertical", "horizontal", "auto"], default: "auto" },
      galleryImageIds: [{ type: String }]
    }],
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
  gallery: {
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
  stories: {
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

export default mongoose.models.HomeConfig || mongoose.model<IHomeConfig>('HomeConfig', HomeConfigSchema);
