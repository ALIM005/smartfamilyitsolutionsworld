'use client';


import { memo, useCallback, useDeferredValue, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { CATEGORIES, postHref } from '@/lib/blog';
import type { BlogPost, CategorySlug } from '@/lib/blog';


/*
  Smart Family Point – Blog (bilingual: English large, Bangla small)
  Blush #FFF4F6/#FDE6EC/#FBD3DE · Magenta #B0124F→#D81B7A · Plum #4A0F2E/#2E0A1C · Gold #C9A24B/#E3B964
*/


type SortOption = 'latest' | 'popular';
type CategoryFilter = 'all' | CategorySlug;


const LIKED_KEY = 'blog_liked_posts';
const SAVED_KEY = 'blog_saved_posts';


const focusRing =
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B0124F] focus-visible:ring-offset-2';
const gradientBtn =
  'bg-linear-to-r from-[#B0124F] to-[#D81B7A] text-white shadow-md shadow-[#B0124F]/30 transition hover:from-[#990F44] hover:to-[#C21769] motion-reduce:transition-none';


const dateFormatter = new Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeZone: 'UTC' });
const formatDateEn = (iso: string): string => dateFormatter.format(new Date(`${iso}T00:00:00Z`));
const toBnDigits = (n: number): string => n.toLocaleString('bn-BD');


const toggleIn = (list: string[], value: string): string[] =>
  list.includes(value) ? list.filter((x) => x !== value) : [...list, value];


function readList(key: string): string[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(key) ?? '[]');
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : [];
  } catch {
    return [];
  }
}


function writeList(key: string, value: string[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable (private mode) – ignore */
  }
}


/* ---------- Bilingual text: English large, Bangla small ---------- */
function Bi({
  en,
  bn,
  enClass = '',
  bnClass = '',
}: {
  en: ReactNode;
  bn: ReactNode;
  enClass?: string;
  bnClass?: string;
}) {
  return (
    <>
      <span className={`block ${enClass}`}>{en}</span>
      <span lang="bn" className={`block text-[0.72em] font-medium leading-snug opacity-80 ${bnClass}`}>
        {bn}
      </span>
    </>
  );
}


const Pill = memo(function Pill({
  active,
  en,
  bn,
  onClick,
}: {
  active: boolean;
  en: string;
  bn: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-2xl px-4 py-2 text-center transition motion-reduce:transition-none ${
        active
          ? 'bg-linear-to-r from-[#B0124F] to-[#D81B7A] text-white shadow-md shadow-[#B0124F]/30'
          : 'border border-[#F3C6D3] bg-white text-[#4A0F2E] hover:bg-[#FDE6EC]'
      } ${focusRing}`}
    >
      <Bi en={en} bn={bn} enClass="text-sm font-bold leading-tight" bnClass="text-[11px]" />
    </button>
  );
});


const Icon = ({ d, filled = false }: { d: string; filled?: boolean }) => (
  <svg
    className="h-4 w-4"
    viewBox="0 0 24 24"
    fill={filled ? 'currentColor' : 'none'}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d={d} />
  </svg>
);
const HEART = 'M12 21s-8-5.2-8-11a4.5 4.5 0 018-2.8A4.5 4.5 0 0120 10c0 5.8-8 11-8 11z';
const BOOKMARK = 'M6 4h12v17l-6-4-6 4V4z';
const SHARE = 'M4 12v7a1 1 0 001 1h14a1 1 0 001-1v-7M16 6l-4-4-4 4M12 2v14';


/* ---------- Post card ---------- */
interface PostCardProps {
  post: BlogPost;
  liked: boolean;
  saved: boolean;
  copied: boolean;
  featured?: boolean;
  onLike: (slug: string) => void;
  onSave: (slug: string) => void;
  onShare: (post: BlogPost) => void;
  onTag: (tag: string) => void;
}


const PostCard = memo(function PostCard({
  post,
  liked,
  saved,
  copied,
  featured = false,
  onLike,
  onSave,
  onShare,
  onTag,
}: PostCardProps) {
  const category = CATEGORIES[post.category];
  const likeCount = post.likes + (liked ? 1 : 0);
  const actionCls = `inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition motion-reduce:transition-none ${focusRing}`;


  return (
    <article
      id={post.slug}
      className={`scroll-mt-40 flex h-full overflow-hidden rounded-2xl border bg-white shadow-md shadow-[#B0124F]/5 transition-shadow hover:shadow-xl hover:shadow-[#B0124F]/15 motion-reduce:transition-none ${
        featured ? 'flex-col border-[#E3B964] lg:flex-row' : 'flex-col border-[#F3C6D3]'
      }`}
    >
      {post.coverImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.coverImage}
          alt=""
          loading="lazy"
          decoding="async"
          className={`w-full object-cover ${featured ? 'h-48 lg:h-auto lg:w-2/5' : 'h-40'}`}
        />
      ) : (
        <div
          className={`flex items-center justify-center bg-linear-to-br from-[#FDE6EC] to-[#FBD3DE] text-5xl ${
            featured ? 'h-48 lg:h-auto lg:w-2/5' : 'h-40'
          }`}
          aria-hidden="true"
        >
          {post.videoUrl ? '▶' : '📰'}
        </div>
      )}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <span className="rounded-full bg-linear-to-r from-[#B0124F] to-[#D81B7A] px-3 py-1 text-white">
            <span className="block text-xs font-bold leading-tight">{category.en}</span>
            <span lang="bn" className="block text-[10px] leading-tight opacity-90">{category.bn}</span>
          </span>
          <span className="text-right text-[#7A5566]">
            <time dateTime={post.dateISO} className="block text-xs font-semibold">{formatDateEn(post.dateISO)}</time>
            <span lang="bn" className="block text-[10px]">{post.dateBn}</span>
          </span>
        </div>


        <h2 className={`font-serif font-bold text-[#2E0A1C] ${featured ? 'text-2xl sm:text-3xl' : 'text-xl'}`}>
          <Bi en={post.title.en} bn={post.title.bn} bnClass="font-sans !text-[0.6em] font-medium text-[#7A5566]" />
        </h2>


        <p className="mt-3 text-[#4A0F2E]">
          <span className="block text-sm sm:text-base">{post.excerpt.en}</span>
          <span lang="bn" className="mt-1 block text-xs text-[#7A5566] sm:text-sm">{post.excerpt.bn}</span>
        </p>


        <p className="mt-3 text-xs text-[#7A5566]">
          {post.readMinutes} min read · <span lang="bn">Read in {toBnDigits(post.readMinutes)} minutes</span>
        </p>


        {post.tags.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <li key={tag}>
                <button
                  type="button"
                  onClick={() => onTag(tag)}
                  className={`rounded-full bg-[#FDE6EC] px-3 py-1 text-xs font-semibold text-[#B0124F] hover:bg-[#FBD3DE] ${focusRing}`}
                >
                  #{tag}
                </button>
              </li>
            ))}
          </ul>
        )}


        <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-[#F3C6D3] pt-4">
          <button
            type="button"
            onClick={() => onLike(post.slug)}
            aria-pressed={liked}
            aria-label={liked ? 'Unlike this post' : 'Like this post'}
            className={`${actionCls} ${
              liked ? 'border-[#B0124F] bg-[#FDE6EC] text-[#B0124F]' : 'border-[#F3C6D3] text-[#4A0F2E] hover:bg-[#FDE6EC]'
            }`}
          >
            <Icon d={HEART} filled={liked} />
            Like{likeCount > 0 && <span> · {likeCount}</span>}
          </button>
          <button
            type="button"
            onClick={() => onSave(post.slug)}
            aria-pressed={saved}
            aria-label={saved ? 'Remove from saved' : 'Save this post'}
            className={`${actionCls} ${
              saved ? 'border-[#C9A24B] bg-[#FBF1D9] text-[#7A5A12]' : 'border-[#F3C6D3] text-[#4A0F2E] hover:bg-[#FDE6EC]'
            }`}
          >
            <Icon d={BOOKMARK} filled={saved} />
            {saved ? 'Saved' : 'Save'}
          </button>
          <button
            type="button"
            onClick={() => onShare(post)}
            aria-label="Share this post"
            className={`${actionCls} border-[#F3C6D3] text-[#4A0F2E] hover:bg-[#FDE6EC]`}
          >
            <Icon d={SHARE} />
            {copied ? 'Copied!' : 'Share'}
          </button>
          <Link
            href={postHref(post)}
            className={`ml-auto rounded-full px-4 py-2 text-xs font-semibold ${gradientBtn} ${focusRing}`}
          >
            Read more →
            <span lang="bn" className="ml-1 text-[10px] opacity-90">Details</span>
          </Link>
        </div>
      </div>
    </article>
  );
});


/* ---------- Page UI ---------- */
export default function BlogClient({ posts }: { posts: readonly BlogPost[] }) {
  const [search, setSearch] = useState<string>('');
  const [category, setCategory] = useState<CategoryFilter>('all');
  const [tag, setTag] = useState<string>('');
  const [sort, setSort] = useState<SortOption>('latest');
  const [savedOnly, setSavedOnly] = useState<boolean>(false);
  const [liked, setLiked] = useState<string[]>([]);
  const [saved, setSaved] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState<boolean>(false);
  const [copiedSlug, setCopiedSlug] = useState<string>('');
  const [announcement, setAnnouncement] = useState<string>('');


  const deferredSearch = useDeferredValue(search);


  // Restore the visitor's likes/saves after mount (no hydration mismatch)
  useEffect(() => {
    setLiked(readList(LIKED_KEY));
    setSaved(readList(SAVED_KEY));
    setHydrated(true);
  }, []);
  useEffect(() => {
    if (hydrated) writeList(LIKED_KEY, liked);
  }, [liked, hydrated]);
  useEffect(() => {
    if (hydrated) writeList(SAVED_KEY, saved);
  }, [saved, hydrated]);
  useEffect(() => {
    if (!copiedSlug) return;
    const timer = window.setTimeout(() => setCopiedSlug(''), 1800);
    return () => window.clearTimeout(timer);
  }, [copiedSlug]);


  const handleLike = useCallback((slug: string): void => setLiked((prev) => toggleIn(prev, slug)), []);
  const handleSave = useCallback((slug: string): void => setSaved((prev) => toggleIn(prev, slug)), []);


  const handleShare = useCallback(async (post: BlogPost): Promise<void> => {
    const url = `${window.location.origin}/blog#${post.slug}`;
    try {
      if (typeof navigator.share === 'function') {
        await navigator.share({ title: post.title.en, text: post.excerpt.en, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopiedSlug(post.slug);
      setAnnouncement('Link copied. The link has been copied.');
    } catch {
      /* share dismissed or clipboard blocked – nothing to do */
    }
  }, []);


  /* Derived data (real, not hard-coded) */
  const categoryCounts = useMemo(() => {
    const counts: Partial<Record<CategorySlug, number>> = {};
    posts.forEach((p) => {
      counts[p.category] = (counts[p.category] ?? 0) + 1;
    });
    return counts;
  }, [posts]);


  const trendingTags = useMemo(() => {
    const counts = new Map<string, number>();
    posts.forEach((p) => p.tags.forEach((t) => counts.set(t, (counts.get(t) ?? 0) + 1)));
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
  }, [posts]);


  const filtersActive = Boolean(deferredSearch.trim() || category !== 'all' || tag || savedOnly);


  const visible = useMemo(() => {
    const q = deferredSearch.trim().toLowerCase();
    const result = posts.filter((p) => {
      const cat = CATEGORIES[p.category];
      const haystack = [p.title.en, p.title.bn, p.excerpt.en, p.excerpt.bn, cat.en, cat.bn, ...p.tags]
        .join(' ')
        .toLowerCase();
      return (
        (!q || haystack.includes(q)) &&
        (category === 'all' || p.category === category) &&
        (!tag || p.tags.includes(tag)) &&
        (!savedOnly || saved.includes(p.slug))
      );
    });
    return [...result].sort((a, b) => {
      if (sort === 'popular') {
        const diff = b.likes + (liked.includes(b.slug) ? 1 : 0) - (a.likes + (liked.includes(a.slug) ? 1 : 0));
        if (diff !== 0) return diff;
      }
      return b.dateISO.localeCompare(a.dateISO);
    });
  }, [posts, deferredSearch, category, tag, savedOnly, saved, sort, liked]);


  // Featured card only when there are several posts and no filter is applied
  const featuredPost = !filtersActive && posts.length > 1 ? (visible.find((p) => p.featured) ?? visible[0]) : null;
  const gridPosts = featuredPost ? visible.filter((p) => p.slug !== featuredPost.slug) : visible;


  const clearFilters = (): void => {
    setSearch('');
    setCategory('all');
    setTag('');
    setSavedOnly(false);
  };


  const renderCard = (post: BlogPost, featured = false) => (
    <PostCard
      key={post.slug}
      post={post}
      featured={featured}
      liked={liked.includes(post.slug)}
      saved={saved.includes(post.slug)}
      copied={copiedSlug === post.slug}
      onLike={handleLike}
      onSave={handleSave}
      onShare={handleShare}
      onTag={setTag}
    />
  );


  return (
    <>
      {/* ===== Banner ===== */}
      <section
        aria-labelledby="blog-title"
        className="relative overflow-hidden bg-linear-to-br from-[#4A0F2E] via-[#B0124F] to-[#D81B7A] px-4 py-14 text-center text-white sm:py-20"
      >
        <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-[#E3B964]/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-white/15 blur-3xl" />
        <div className="relative mx-auto max-w-3xl">
          <p className="mb-3 flex items-center justify-center gap-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#E3B964] sm:text-xs">
            <span className="h-px w-8 bg-[#E3B964] sm:w-10" />
            Smart Family Point
            <span className="h-px w-8 bg-[#E3B964] sm:w-10" />
          </p>
          <h1 id="blog-title" className="font-serif font-bold">
            <span className="block text-4xl sm:text-5xl lg:text-6xl">
              Our <span className="italic text-[#FBD3DE]">Blog</span>
            </span>
            <span lang="bn" className="mt-2 block font-sans text-lg font-medium text-[#FDE6EC] sm:text-xl">
              Our Blog
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-[#FDE6EC]">
            <span className="block text-base sm:text-lg">Browse our latest posts, articles and updates.</span>
            <span lang="bn" className="mt-1 block text-xs opacity-90 sm:text-sm">
              Here you can see all our recent posts, articles, and updates.
            </span>
          </p>
        </div>
      </section>


      <main className="mx-auto w-full max-w-[1920px] px-4 py-10 sm:px-6 sm:py-14 lg:px-10 2xl:px-16">
        {/* ===== Controls ===== */}
        <section aria-label="Search and filters" className="mb-8 rounded-3xl border border-[#F3C6D3] bg-white p-4 shadow-lg shadow-[#B0124F]/5 sm:p-6">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div>
              <label htmlFor="blog-search" className="mb-1.5 block text-[#4A0F2E]">
                <Bi en="Search posts" bn="Search posts" enClass="text-sm font-bold" bnClass="text-xs" />
              </label>
              <div className="relative">
                <svg className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#B590A0]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <circle cx="11" cy="11" r="7" />
                  <path d="M20 20l-3.5-3.5" />
                </svg>
                <input
                  id="blog-search"
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Title, topic or tag… / Title, topic or tag…"
                  className="w-full rounded-2xl border border-[#F3C6D3] bg-[#FFFAFB] py-3 pl-12 pr-4 text-sm text-[#2E0A1C] placeholder:text-[#B590A0] focus:border-[#B0124F] focus:outline-none focus:ring-2 focus:ring-[#B0124F]/25"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Sort posts">
              <Pill active={sort === 'latest'} en="Latest" bn="Latest" onClick={() => setSort('latest')} />
              <Pill active={sort === 'popular'} en="Popular" bn="Popular" onClick={() => setSort('popular')} />
              <Pill active={savedOnly} en="Saved" bn="Saved" onClick={() => setSavedOnly((v) => !v)} />
            </div>
          </div>


          <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Filter by category">
            <Pill active={category === 'all'} en="All" bn="All" onClick={() => setCategory('all')} />
            {(Object.keys(CATEGORIES) as CategorySlug[])
              .filter((slug) => categoryCounts[slug])
              .map((slug) => (
                <Pill
                  key={slug}
                  active={category === slug}
                  en={`${CATEGORIES[slug].en} (${categoryCounts[slug]})`}
                  bn={CATEGORIES[slug].bn}
                  onClick={() => setCategory(slug)}
                />
              ))}
          </div>


          {trendingTags.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[#F3C6D3] pt-4">
              <span className="text-[#4A0F2E]">
                <Bi en="Trending topics" bn="Popular topics" enClass="text-xs font-bold uppercase tracking-wider" bnClass="text-[10px]" />
              </span>
              {trendingTags.map(([name, count]) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setTag(tag === name ? '' : name)}
                  aria-pressed={tag === name}
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    tag === name ? 'bg-[#B0124F] text-white' : 'bg-[#FDE6EC] text-[#B0124F] hover:bg-[#FBD3DE]'
                  } ${focusRing}`}
                >
                  #{name} <span className="opacity-70">· {count}</span>
                </button>
              ))}
            </div>
          )}
        </section>


        {/* ===== Result summary ===== */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 text-sm text-[#4A0F2E]">
          <p aria-live="polite">
            <strong>{visible.length}</strong> {visible.length === 1 ? 'post' : 'posts'}
            <span lang="bn" className="ml-2 text-xs text-[#7A5566]">{toBnDigits(visible.length)} posts</span>
          </p>
          {filtersActive && (
            <button type="button" onClick={clearFilters} className={`rounded-full border border-[#B0124F] px-4 py-1.5 text-xs font-semibold text-[#B0124F] hover:bg-[#FDE6EC] ${focusRing}`}>
              Clear filters <span lang="bn" className="ml-1 text-[10px]">Clear filters</span>
            </button>
          )}
        </div>


        {/* ===== Posts ===== */}
        {featuredPost && (
          <section aria-label="Featured post" className="mb-6">
            {renderCard(featuredPost, true)}
          </section>
        )}


        {visible.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed border-[#E3B964] bg-white/70 px-6 py-14 text-center">
            <p className="text-4xl" aria-hidden="true">🔍</p>
            <p className="mt-3 font-serif text-xl font-bold text-[#4A0F2E]">No posts found</p>
            <p lang="bn" className="mt-1 text-sm text-[#7A5566]">No posts were found.</p>
            {filtersActive && (
              <button type="button" onClick={clearFilters} className={`mt-5 rounded-full px-5 py-2 text-sm font-semibold ${gradientBtn} ${focusRing}`}>
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {gridPosts.map((post) => (
              <li key={post.slug}>{renderCard(post)}</li>
            ))}
            {!filtersActive && (
              <li>
                <div className="flex h-full min-h-64 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#E3B964] bg-white/60 p-6 text-center">
                  <span className="mb-2 text-3xl text-[#C9A24B]" aria-hidden="true">✦</span>
                  <p className="font-serif text-lg font-bold text-[#4A0F2E]">More posts coming soon</p>
                  <p lang="bn" className="mt-1 text-sm text-[#7A5566]">New posts coming soon</p>
                </div>
              </li>
            )}
          </ul>
        )}


        <div role="status" aria-live="polite" className="sr-only">
          {announcement}
        </div>
      </main>
    </>
  );
}