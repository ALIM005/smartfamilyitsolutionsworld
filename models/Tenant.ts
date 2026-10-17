import { Schema, models, model } from 'mongoose';

const TenantSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    domain: { type: String },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default models.Tenant || model('Tenant', TenantSchema);
