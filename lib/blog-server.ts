// lib/blog-server.ts — blog queries + serializer (server only)
import { connectMongo } from '@/lib/mongo';
import BlogPost from '@/models/BlogPost';
import type { LeanBlogDoc } from '@/models/BlogPost';
import { POSTS, formatDateBn } from '@/lib/blog';
import type { AdminBlogPostView, BlogPost as BlogPostView } from '@/lib/blog';

/** Export combined type so both admin panel and public pages get full fields safely */
export type FullBlogPost = BlogPostView & AdminBlogPostView;

/** Database document → plain JSON-safe object used by pages and the admin panel. */
export function toPost(doc: LeanBlogDoc): FullBlogPost {
  const iso = new Date(doc.publishedAt).toISOString().slice(0, 10);
  return {
    id: String(doc._id),
    published: doc.published,
    slug: doc.slug,
    title: { en: doc.titleEn || doc.titleBn, bn: doc.titleBn || doc.titleEn },
    excerpt: { en: doc.excerptEn || doc.excerptBn, bn: doc.excerptBn || doc.excerptEn },
    content: { en: doc.contentEn, bn: doc.contentBn },
    category: doc.category,
    dateISO: iso,
    dateBn: formatDateBn(iso),
    readMinutes: doc.readMinutes,
    tags: doc.tags,
    likes: doc.likes,
    featured: doc.featured,
    coverImage: doc.coverImage || undefined,
    images: doc.images,
    videoUrl: doc.videoUrl || undefined,
  };
}

/** Published posts for the public blog. Falls back to the starter post only if the DB is unreachable. */
export async function getPublishedPosts(): Promise<BlogPostView[]> {
  try {
    await connectMongo();
    const docs = await BlogPost.find({ published: true }).sort({ publishedAt: -1 }).limit(200).lean<LeanBlogDoc[]>();
    return docs.map(toPost);
  } catch (error) {
    console.error('[blog] database unavailable, using fallback posts:', error);
    return [...POSTS];
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPostView | null> {
  try {
    await connectMongo();
    const doc = await BlogPost.findOne({ slug, published: true }).lean<LeanBlogDoc>();
    return doc ? toPost(doc) : null;
  } catch (error) {
    console.error('[blog] database unavailable, using fallback posts:', error);
    return POSTS.find((p) => p.slug === slug) ?? null;
  }
}