// models/BlogPost.ts — blog post model (same style as models/Product)
import mongoose, { Schema } from 'mongoose';
import type { Model } from 'mongoose';
import type { CategorySlug } from '@/lib/blog';

export interface BlogDoc {
  slug: string;
  titleEn: string;
  titleBn: string;
  excerptEn: string;
  excerptBn: string;
  contentEn: string;
  contentBn: string;
  category: CategorySlug;
  tags: string[];
  publishedAt: Date;
  readMinutes: number;
  featured: boolean;
  published: boolean;
  coverImage: string;
  images: string[];
  videoUrl: string;
  likes: number;
}

export type LeanBlogDoc = BlogDoc & { _id: mongoose.Types.ObjectId };

const schema = new Schema<BlogDoc>(
  {
    slug: { type: String, required: true, unique: true, trim: true, maxlength: 120 },
    titleEn: { type: String, default: '', maxlength: 200 },
    titleBn: { type: String, default: '', maxlength: 200 },
    excerptEn: { type: String, default: '', maxlength: 500 },
    excerptBn: { type: String, default: '', maxlength: 500 },
    contentEn: { type: String, default: '', maxlength: 20000 },
    contentBn: { type: String, default: '', maxlength: 20000 },
    category: { type: String, enum: ['announcement', 'update', 'offer', 'guide'], default: 'update' },
    tags: { type: [String], default: [] },
    publishedAt: { type: Date, default: Date.now, index: true },
    readMinutes: { type: Number, default: 1 },
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: false, index: true },
    coverImage: { type: String, default: '' },
    images: { type: [String], default: [] },
    videoUrl: { type: String, default: '' },
    likes: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const BlogPost: Model<BlogDoc> =
  (mongoose.models.BlogPost as Model<BlogDoc> | undefined) ?? mongoose.model<BlogDoc>('BlogPost', schema);

export default BlogPost;