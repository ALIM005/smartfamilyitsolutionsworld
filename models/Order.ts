// models/Order.ts
import mongoose, { Schema, InferSchemaType, Model } from 'mongoose';

export const ORDER_STATUSES = [
  'Pending',
  'Processing',
  'Packaging',
  'Shipped',
  'Delivered',
  'Cancelled',
] as const;

export const PAYMENT_METHODS = ['bKash', 'Nagad', 'Rocket', 'Card', 'COD'] as const;

const OrderItemSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    // অর্ডারের সময়ের তথ্য সংরক্ষণ, পরে দাম বদলালেও পুরনো অর্ডার ঠিক থাকবে
    name: { type: String, required: true },
    sku: String,
    unitPrice: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1, max: 20 },
    color: String,
    size: String,
  },
  { _id: false }
);

const OrderSchema = new Schema(
  {
    orderNumber: { type: String, required: true, unique: true, index: true },
    customer: {
      name: { type: String, required: true, trim: true, maxlength: 120 },
      phone: { type: String, required: true, trim: true },
      address: { type: String, required: true, trim: true, maxlength: 500 },
    },
    items: { type: [OrderItemSchema], validate: (v: unknown[]) => v.length > 0 },
    paymentMethod: { type: String, enum: PAYMENT_METHODS, required: true },
    // bKash/Nagad/Rocket এর ট্রানজেকশন আইডি (ম্যানুয়াল ভেরিফিকেশনের জন্য)
    paymentTrxId: { type: String, trim: true },
    paymentStatus: { type: String, enum: ['Unpaid', 'Paid', 'Refunded'], default: 'Unpaid' },
    couponCode: String,
    subtotal: { type: Number, required: true },
    vat: { type: Number, required: true },
    shipping: { type: Number, required: true },
    discount: { type: Number, required: true, default: 0 },
    total: { type: Number, required: true },
    status: { type: String, enum: ORDER_STATUSES, default: 'Pending', index: true },
    statusHistory: {
      type: [{ status: String, at: { type: Date, default: Date.now }, _id: false }],
      default: [],
    },
  },
  { timestamps: true }
);

OrderSchema.index({ 'customer.phone': 1, createdAt: -1 });

export type OrderDoc = InferSchemaType<typeof OrderSchema> & { _id: mongoose.Types.ObjectId };

export default (mongoose.models.Order as Model<OrderDoc>) ||
  mongoose.model<OrderDoc>('Order', OrderSchema);
