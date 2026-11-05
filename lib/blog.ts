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
  excerpt: Bilingual; // Added for access in the admin form
  content?: Bilingual; // Added for access in the admin form
  category: CategorySlug;
  dateISO: string;
  tags: string[]; // Added to handle the admin form's tags
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
  announcement: { en: 'Announcement', bn: 'Announcement' },
  update: { en: 'Update', bn: 'Update' },
  offer: { en: 'Offer', bn: 'Offer' },
  guide: { en: 'Guide', bn: 'Guide' },
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


// To add a new post, add an object to this array
export const POSTS: readonly BlogPost[] = [
  {
    slug: 'first-post',
    title: { en: 'First Blog Post', bn: 'First Blog Post' },
    excerpt: {
      en: 'Read this post in full to learn more about our new products and offers.',
      bn: 'Read this post in full to learn more about our new products and offers.',
    },
    content: {
      en: 'This is the first paragraph of our blog post in English.\n\nThis is the second paragraph with more details.',
      bn: 'This is the first paragraph of our blog post in Bangla.\n\nThis is the second paragraph with more details.',
    },
    category: 'update',
    dateISO: '2026-11-01',
    dateBn: 'November 1, 2026',
    readMinutes: 2,
    tags: ['Products', 'Offers'],
    likes: 0,
    featured: true,
  },
];