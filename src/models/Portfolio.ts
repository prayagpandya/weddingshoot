import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IPortfolio extends Document {
  title: string;
  place: string;
  tag: string;
  categoryId: Types.ObjectId;
  imageId: string; // Cover image
  galleryImageIds?: string[]; // Album photos
  orientation?: 'vertical' | 'horizontal' | 'auto';
}

const PortfolioSchema: Schema = new Schema({
  title: { type: String, required: true },
  place: { type: String, required: true },
  tag: { type: String, required: true }, 
  categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  imageId: { type: String, required: true },
  galleryImageIds: [{ type: String }],
  orientation: { type: String, enum: ["vertical", "horizontal", "auto"], default: "auto" },
}, { timestamps: true });

export default mongoose.models.Portfolio || mongoose.model<IPortfolio>('Portfolio', PortfolioSchema);
