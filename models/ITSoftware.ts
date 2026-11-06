import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IITSoftware extends Document {
  title: string;
  slug: string;
  version?: string;
  description?: string;
  price?: number;
  image?: string;
  features?: string[];
  techStack?: string[];
  active?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ITSoftwareSchema = new Schema<IITSoftware>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    version: { type: String, default: '1.0.0' },
    description: { type: String, default: '' },
    price: { type: Number, default: 0 },
    image: { type: String, default: '' },
    features: { type: [String], default: [] },
    techStack: { type: [String], default: [] },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const ITSoftware: Model<IITSoftware> =
  mongoose.models.ITSoftware ||
  mongoose.model<IITSoftware>('ITSoftware', ITSoftwareSchema);

export default ITSoftware;