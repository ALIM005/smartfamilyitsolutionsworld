import { Schema, models, model } from 'mongoose';


const UserSchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    name: { type: String, trim: true },
    role: { type: String, enum: ['owner', 'admin', 'user'], default: 'user' },
  },
  { timestamps: true }
);


// The same email can have separate accounts in different products
UserSchema.index({ tenantId: 1, email: 1 }, { unique: true });


export default models.User || model('User', UserSchema);