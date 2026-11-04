import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import SiteShell from '@/components/SiteShell';
import { CATEGORIES, getYouTubeId } from '@/lib/blog';
import { getPostBySlug } from '@/lib/blog-server';

export const revalidate = 300;

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const post = await getPostBySlug(resolvedParams.slug);
  if (!post) return { title: 'Post not found - Smart Family Point' };
  return {
    title: `${post.title.en} - Smart Family Point`,
    description: post.excerpt.en || post.excerpt.bn,
    openGraph: {
      title: post.title.en,
      description: post.excerpt.en || post.excerpt.bn,
      type: 'article',
      publishedTime: post.dateISO,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  };
}

const paragraphs = (text?: string): string[] =>
  (text ?? '').split(/\n{2,}/).map((s) => s.trim()).filter(Boolean);

function Video({ url, title }: { url: string; title: string }) {
  const yt = getYouTubeId(url);
  if (yt) {
    return (
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(yt)}`}
        title={title}
        loading="lazy"
        allow="accelerometer; encrypted-media; picture-in-picture; fullscreen"
        allowFullScreen
        className="aspect-video w-full rounded-2xl border border-[#F3C6D3] bg-black"
      />
    );
  }
  return (
    <video controls preload="metadata" playsInline src={url} className="aspect-video w-full rounded-2xl border border-[#F3C6D3] bg-black" />
  );
}

export default async function BlogPostPage({ params }: PageProps) {
  const resolvedParams = await params;
  const post = await getPostBySlug(resolvedParams.slug);
  if (!post) notFound();

  const category = CATEGORIES[post.category];
  const en = paragraphs(post.content?.en);
  const bn = paragraphs(post.content?.bn);
  const rows = Math.max(en.length, bn.length);

  return (
    <SiteShell>
      <article>
        <header className="bg-linear-to-br from-[#4A0F2E] via-[#B0124F] to-[#D81B7A] px-4 py-12 text-center text-white sm:py-16">
          <div className="mx-auto max-w-3xl">
            <p className="mb-3 inline-block rounded-full bg-white/15 px-4 py-1 text-xs font-semibold">
              {category?.en} · <span lang="bn">{category?.bn}</span>
            </p>
            <h1 className="font-serif font-bold">
              <span className="block text-3xl sm:text-5xl">{post.title.en}</span>
              <span lang="bn" className="mt-2 block font-sans text-lg font-medium text-[#FDE6EC] sm:text-xl">{post.title.bn}</span>
            </h1>
            <p className="mt-4 text-sm text-[#FDE6EC]">
              <time dateTime={post.dateISO}>{post.dateISO}</time> · <span lang="bn">{post.dateBn}</span> · {post.readMinutes} min read
            </p>
          </div>
        </header>

        <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:py-14">
          {post.coverImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={post.coverImage} alt={post.title.en} className="mb-8 w-full rounded-2xl border border-[#F3C6D3] object-cover shadow-lg" />
          )}

          {(post.excerpt.en || post.excerpt.bn) && (
            <p className="mb-8 rounded-2xl border-l-4 border-[#C9A24B] bg-[#FFF4F6] p-5 text-[#4A0F2E]">
              <span className="block text-base sm:text-lg">{post.excerpt.en}</span>
              <span lang="bn" className="mt-1 block text-sm text-[#7A5566]">{post.excerpt.bn}</span>
            </p>
          )}

          <div className="space-y-6">
            {Array.from({ length: rows }, (_, i) => (
              <div key={i}>
                {en[i] && <p className="whitespace-pre-line text-base leading-8 text-[#2E0A1C] sm:text-lg">{en[i]}</p>}
                {bn[i] && <p lang="bn" className="mt-2 whitespace-pre-line text-sm leading-7 text-[#7A5566] sm:text-base">{bn[i]}</p>}
              </div>
            ))}
          </div>

          {post.videoUrl && (
            <div className="mt-10">
              <Video url={post.videoUrl} title={post.title.en} />
            </div>
          )}

          {post.images && post.images.length > 0 && (
            <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {post.images.map((src, i) => (
                <li key={src}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={`${post.title.en} – ${i + 1}`} loading="lazy" className="w-full rounded-2xl border border-[#F3C6D3] object-cover" />
                </li>
              ))}
            </ul>
          )}

          {post.tags && post.tags.length > 0 && (
            <ul className="mt-10 flex flex-wrap gap-2">
              {post.tags.map((t) => (
                <li key={t} className="rounded-full bg-[#FDE6EC] px-3 py-1 text-xs font-semibold text-[#B0124F]">#{t}</li>
              ))}
            </ul>
          )}

          <Link
            href="/blog"
            className="mt-10 inline-block rounded-full bg-linear-to-r from-[#B0124F] to-[#D81B7A] px-6 py-3 text-sm font-semibold text-white shadow-md shadow-[#B0124F]/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B0124F] focus-visible:ring-offset-2"
          >
            ← Back to Blog <span lang="bn" className="ml-1 text-xs opacity-90">ব্লগে ফিরুন</span>
          </Link>
        </div>
      </article>
    </SiteShell>
  );
}