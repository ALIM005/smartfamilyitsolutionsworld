import type { Metadata } from 'next';
import SiteShell from '@/components/SiteShell';
import BlogClient from '@/components/BlogClient';
import { getPublishedPosts } from '@/lib/blog-server';

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? '').replace(/\/$/, '');

// Refreshes at most every 5 minutes; the admin panel also refreshes it instantly on every save.
export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Blog - Smart Family Point',
  description: 'Explore our latest articles and updates. আমাদের সাম্প্রতিক পোস্ট, আর্টিকেল ও আপডেট।',
  openGraph: {
    title: 'Blog - Smart Family Point',
    description: 'Explore our latest articles and updates.',
    type: 'website',
    siteName: 'Smart Family Point',
  },
  alternates: SITE_URL ? { canonical: `${SITE_URL}/blog` } : undefined,
};

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  // Structured data helps Google understand the blog (SEO)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Smart Family Point Blog',
    url: SITE_URL ? `${SITE_URL}/blog` : undefined,
    blogPost: posts.map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title.en,
      alternativeHeadline: post.title.bn,
      description: post.excerpt.en,
      datePublished: post.dateISO,
      keywords: post.tags.join(', '),
      image: post.coverImage,
      url: SITE_URL ? `${SITE_URL}/blog/${post.slug}` : undefined,
      publisher: { '@type': 'Organization', name: 'Smart Family Point' },
    })),
  };

  return (
    <SiteShell>
      <script
        type="application/ld+json"
        // JSON.stringify output only; '<' escaped to prevent script injection
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <BlogClient posts={posts} />
    </SiteShell>
  );
}