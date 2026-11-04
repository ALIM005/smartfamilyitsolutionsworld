// lib/blog.ts — blog data (replace POSTS with a database / CMS query later)

export type CategorySlug = 'announcement' | 'update' | 'offer' | 'guide';

export interface Bilingual {
  en: string;
  bn: string;
}

export interface BlogPost {
  id?: string;
  slug: string; // unique, URL-safe, used as the #anchor
  title: Bilingual;
  excerpt: Bilingual;
  content?: Bilingual;
  category: CategorySlug;
  dateISO: string; // YYYY-MM-DD
  dateBn: string; // Bangla date label
  readMinutes: number;
  tags: string[];
  likes: number; // server-side like count (0 until you add a database)
  featured?: boolean;
  published?: boolean;
  coverImage?: string;
  videoUrl?: string;
  images?: string[];
  href?: string; // set when the post has its own page, e.g. '/blog/first-post'
}

export interface AdminBlogPost {
  id?: string;
  slug: string;
  title: Bilingual;
  excerpt: Bilingual; // অ্যাডমিন ফর্মে এক্সেস করার জন্য যুক্ত করা হয়েছে
  content?: Bilingual; // অ্যাডমিন ফর্মে এক্সেস করার জন্য যুক্ত করা হয়েছে
  category: CategorySlug;
  dateISO: string;
  tags: string[]; // অ্যাডমিন ফর্মের ট্যাগ হ্যান্ডেল করার জন্য যুক্ত করা হয়েছে
  featured?: boolean;
  published?: boolean;
  coverImage?: string;
  videoUrl?: string;
  images?: string[];
}

export interface AdminBlogPostView extends AdminBlogPost {
  likes: number;
}

export const CATEGORIES: Record<CategorySlug, Bilingual> = {
  announcement: { en: 'Announcement', bn: 'ঘোষণা' },
  update: { en: 'Update', bn: 'আপডেট' },
  offer: { en: 'Offer', bn: 'অফার' },
  guide: { en: 'Guide', bn: 'গাইড' },
};

export function formatDateBn(dateISO: string): string {
  const date = new Date(dateISO);
  return new Intl.DateTimeFormat('bn-BD', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);
}

export function getYouTubeId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

export function postHref(post: BlogPost): string {
  return post.href || `/blog/${post.slug}`;
}

// নতুন পোস্ট যোগ করতে এই অ্যারেতে একটি অবজেক্ট যোগ করুন
export const POSTS: readonly BlogPost[] = [
  {
    slug: 'first-post',
    title: { en: 'First Blog Post', bn: 'প্রথম ব্লগ পোস্ট' },
    excerpt: {
      en: 'Read this post in full to learn more about our new products and offers.',
      bn: 'আমাদের নতুন প্রোডাক্ট এবং অফার সম্পর্কে বিস্তারিত জানতে এই পোস্টটি সম্পূর্ণ পড়ুন।',
    },
    content: {
      en: 'This is the first paragraph of our blog post in English.\n\nThis is the second paragraph with more details.',
      bn: 'এটি আমাদের ব্লগ পোস্টের প্রথম প্যারাগ্রাফ বাংলায়।\n\nএটি বিস্তারিত সহ দ্বিতীয় প্যারাগ্রাফ।',
    },
    category: 'update',
    dateISO: '2026-11-01',
    dateBn: 'নভেম্বর ১, ২০২৬',
    readMinutes: 2,
    tags: ['Products', 'Offers'],
    likes: 0,
    featured: true,
  },
];