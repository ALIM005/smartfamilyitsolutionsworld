// models/Product.ts
import mongoose, { Schema, InferSchemaType, Model } from 'mongoose';


const ProductSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 200 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    sku: { type: String, trim: true, unique: true, sparse: true },
    image: { type: String, required: true },
    category: { type: String, required: true, trim: true, index: true },
    brand: { type: String, trim: true },
    price: { type: Number, required: true, min: 0 },
    // Percentage discount (0-90). The server will calculate the final price.
    discount: { type: Number, default: 0, min: 0, max: 90 },
    stock: { type: Number, required: true, min: 0, default: 0 },
    sold: { type: Number, default: 0, min: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    colors: { type: [String], default: [] },
    sizes: { type: [String], default: [] },
    tags: { type: [String], default: [] },
    featured: { type: Boolean, default: false },
    flashSale: { type: Boolean, default: false },
    active: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);


ProductSchema.index({ name: 'text', brand: 'text', tags: 'text', sku: 'text' });


export type ProductDoc = InferSchemaType<typeof ProductSchema> & { _id: mongoose.Types.ObjectId };


export default (mongoose.models.Product as Model<ProductDoc>) ||
  mongoose.model<ProductDoc>('Product', ProductSchema);