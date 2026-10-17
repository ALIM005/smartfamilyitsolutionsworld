import { Schema, models, model } from 'mongoose';

const SheetDataSchema = new Schema(
  {
    tenantId: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, default: 'Untitled' },
    content: { type: [[String]], default: [] },
  },
  { timestamps: true }
);

SheetDataSchema.index({ tenantId: 1, userId: 1 }, { unique: true });

export default models.SheetData || model('SheetData', SheetDataSchema);
