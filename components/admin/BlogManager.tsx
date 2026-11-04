'use client';

// components/admin/BlogManager.tsx
// অ্যাডমিন পেজের "ব্লগ" ট্যাব: পোস্ট লেখা, ছবি/ভিডিও আপলোড, এডিট, ড্রাফট/পাবলিশ, মোছা।

import { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import { CATEGORIES } from '@/lib/blog';
import type { AdminBlogPost, CategorySlug } from '@/lib/blog';

const field =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-300';
const btn = 'rounded-lg px-4 py-2 text-sm font-bold transition disabled:opacity-50';
const labelCls = 'mb-1 block text-xs font-bold text-slate-600';

type ApiResult<T> = { success: boolean; error?: string } & T;

async function api<T>(path: string, init?: RequestInit): Promise<ApiResult<T>> {
  const res = await fetch(path, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
    cache: 'no-store',
  });
  let data: unknown = {};
  try {
    data = await res.json();
  } catch {
    /* খালি বডি */
  }
  const out = data as ApiResult<T>;
  if (res.status === 401) window.dispatchEvent(new Event('sf-admin-401'));
  if (!res.ok && out.success !== false) return { success: false, error: `Error ${res.status}` } as ApiResult<T>;
  return out;
}

/* ---------------- Upload (browser → Vercel Blob, no server size limit) ---------------- */
function useUploader() {
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState('');

  const run = useCallback(async (file: File, kind: 'image' | 'video'): Promise<string | null> => {
    setError('');
    const limitMB = kind === 'image' ? 10 : 200;
    if (!file.type.startsWith(`${kind}/`)) {
      setError(kind === 'image' ? 'শুধু ছবি (JPG, PNG, WEBP, GIF) দিন' : 'শুধু ভিডিও (MP4, WEBM) দিন');
      return null;
    }
    if (file.size > limitMB * 1024 * 1024) {
      setError(`${kind === 'image' ? 'ছবি' : 'ভিডিও'} ${limitMB}MB এর মধ্যে হতে হবে`);
      return null;
    }
    try {
      setProgress(0);
      const { upload } = await import('@vercel/blob/client');
      const safeName = file.name.replace(/[^\w.-]+/g, '_');
      const blob = await upload(`blog/${safeName}`, file, {
        access: 'public',
        handleUploadUrl: '/api/admin/upload',
        multipart: file.size > 20 * 1024 * 1024,
        onUploadProgress: ({ percentage }) => setProgress(Math.round(percentage)),
      });
      return blob.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'আপলোড হয়নি');
      return null;
    } finally {
      setProgress(null);
    }
  }, []);

  return { progress, error, run };
}

function ProgressBar({ value }: { value: number | null }) {
  if (value === null) return null;
  return (
    <div className="mt-2" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
      <div className="h-2 overflow-hidden rounded-full bg-slate-200">
        <div className="h-full bg-blue-600 transition-all" style={{ width: `${value}%` }} />
      </div>
      <p className="mt-1 text-xs font-bold text-slate-500">আপলোড হচ্ছে… {value}%</p>
    </div>
  );
}

/* ---------------- Single media (cover image / video) ---------------- */
function MediaPicker(props: {
  label: string;
  kind: 'image' | 'video';
  value: string;
  onChange: (url: string) => void;
  hint?: string;
}) {
  const { value, kind } = props;
  const inputRef = useRef<HTMLInputElement>(null);
  const { progress, error, run } = useUploader();

  async function onFile(file: File | undefined) {
    if (!file) return;
    const url = await run(file, kind);
    if (url) props.onChange(url);
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className={labelCls}>{props.label}</p>
      {value &&
        (kind === 'image' ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="mb-3 max-h-48 rounded-lg bg-slate-100 object-cover" />
        ) : /youtu/.test(value) ? (
          <p className="mb-3 break-all rounded-lg bg-slate-50 p-2 text-xs text-slate-600">YouTube: {value}</p>
        ) : (
          <video src={value} controls preload="metadata" className="mb-3 max-h-56 rounded-lg bg-black" />
        ))}
      <div className="flex flex-wrap gap-2">
        <input
          ref={inputRef}
          type="file"
          accept={kind === 'image' ? 'image/jpeg,image/png,image/webp,image/gif' : 'video/mp4,video/webm'}
          className="hidden"
          onChange={(e) => {
            void onFile(e.target.files?.[0]);
            e.target.value = '';
          }}
        />
        <button type="button" disabled={progress !== null} onClick={() => inputRef.current?.click()} className={`${btn} bg-blue-600 text-white hover:bg-blue-700`}>
          {kind === 'image' ? 'ছবি আপলোড' : 'ভিডিও আপলোড'}
        </button>
        {value && (
          <button type="button" onClick={() => props.onChange('')} className={`${btn} bg-red-50 text-red-700 hover:bg-red-100`}>
            সরান
          </button>
        )}
      </div>
      <input
        className={`${field} mt-3`}
        placeholder={kind === 'image' ? 'অথবা ছবির লিংক (https://...)' : 'অথবা YouTube / ভিডিও ফাইলের লিংক (https://...)'}
        value={value}
        onChange={(e) => props.onChange(e.target.value)}
      />
      <ProgressBar value={progress} />
      {error && <p className="mt-2 text-xs font-bold text-red-600">{error}</p>}
      {props.hint && <p className="mt-2 text-xs text-slate-500">{props.hint}</p>}
    </div>
  );
}

/* ---------------- Gallery (many images) ---------------- */
function GalleryPicker(props: { value: string[]; onChange: (urls: string[]) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { progress, error, run } = useUploader();
  const MAX = 12;

  async function onFiles(files: FileList | null) {
    if (!files) return;
    let next = [...props.value];
    for (const file of Array.from(files)) {
      if (next.length >= MAX) break;
      const url = await run(file, 'image');
      if (url) {
        next = [...next, url];
        props.onChange(next);
      }
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className={labelCls}>আরও ছবি (গ্যালারি, সর্বোচ্চ {MAX}টি)</p>
      {props.value.length > 0 && (
        <ul className="mb-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
          {props.value.map((url, i) => (
            <li key={`${url}-${i}`} className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="aspect-square w-full rounded-lg bg-slate-100 object-cover" />
              <button
                type="button"
                aria-label="ছবিটি সরান"
                onClick={() => props.onChange(props.value.filter((_, idx) => idx !== i))}
                className="absolute right-1 top-1 rounded-full bg-black/70 px-2 text-xs font-bold text-white hover:bg-red-600"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => {
          void onFiles(e.target.files);
          e.target.value = '';
        }}
      />
      <button
        type="button"
        disabled={progress !== null || props.value.length >= MAX}
        onClick={() => inputRef.current?.click()}
        className={`${btn} bg-blue-600 text-white hover:bg-blue-700`}
      >
        + ছবি যোগ করুন
      </button>
      <ProgressBar value={progress} />
      {error && <p className="mt-2 text-xs font-bold text-red-600">{error}</p>}
    </div>
  );
}

/* ---------------- Post form (new + edit) ---------------- */
interface FormState {
  titleEn: string;
  titleBn: string;
  excerptEn: string;
  excerptBn: string;
  contentEn: string;
  contentBn: string;
  category: CategorySlug;
  tags: string;
  publishedAt: string;
  slug: string;
  featured: boolean;
  published: boolean;
  coverImage: string;
  videoUrl: string;
  images: string[];
}

const today = (): string => new Date().toISOString().slice(0, 10);

const emptyForm = (): FormState => ({
  titleEn: '', titleBn: '', excerptEn: '', excerptBn: '', contentEn: '', contentBn: '',
  category: 'update', tags: '', publishedAt: today(), slug: '',
  featured: false, published: true, coverImage: '', videoUrl: '', images: [],
});

const fromPost = (p: AdminBlogPost & { tags?: string[]; content?: { en?: string; bn?: string } }): FormState => ({
  titleEn: p.title.en, titleBn: p.title.bn,
  excerptEn: p.excerpt.en, excerptBn: p.excerpt.bn,
  contentEn: p.content?.en ?? '', contentBn: p.content?.bn ?? '',
  category: p.category, tags: p.tags?.join(', ') ?? '', publishedAt: p.dateISO, slug: p.slug,
  featured: Boolean(p.featured), published: Boolean(p.published),
  coverImage: p.coverImage ?? '', videoUrl: p.videoUrl ?? '', images: p.images ?? [],
});

function BlogForm(props: {
  initial: FormState;
  submitLabel: string;
  onSubmit: (f: FormState) => Promise<string | null>;
  onCancel: () => void;
}) {
  const [f, setF] = useState<FormState>(props.initial);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setF((s) => ({ ...s, [k]: v }));

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr('');
    const problem = await props.onSubmit(f);
    setBusy(false);
    if (problem) setErr(problem);
  }

  return (
    <form onSubmit={submit} className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className={labelCls}>Title (English) *</label>
          <input className={field} value={f.titleEn} onChange={(e) => set('titleEn', e.target.value)} maxLength={200} />
        </div>
        <div>
          <label className={labelCls}>শিরোনাম (বাংলা)</label>
          <input className={field} value={f.titleBn} onChange={(e) => set('titleBn', e.target.value)} maxLength={200} />
        </div>
        <div>
          <label className={labelCls}>Short summary (English)</label>
          <textarea className={field} rows={2} value={f.excerptEn} onChange={(e) => set('excerptEn', e.target.value)} maxLength={500} />
        </div>
        <div>
          <label className={labelCls}>সংক্ষিপ্ত বিবরণ (বাংলা)</label>
          <textarea className={field} rows={2} value={f.excerptBn} onChange={(e) => set('excerptBn', e.target.value)} maxLength={500} />
        </div>
        <div>
          <label className={labelCls}>Full article (English) — নতুন অনুচ্ছেদের জন্য একটি ফাঁকা লাইন দিন</label>
          <textarea className={field} rows={8} value={f.contentEn} onChange={(e) => set('contentEn', e.target.value)} maxLength={20000} />
        </div>
        <div>
          <label className={labelCls}>পুরো লেখা (বাংলা)</label>
          <textarea className={field} rows={8} value={f.contentBn} onChange={(e) => set('contentBn', e.target.value)} maxLength={20000} />
        </div>
        <div>
          <label className={labelCls}>ক্যাটেগরি</label>
          <select className={field} value={f.category} onChange={(e) => set('category', e.target.value as CategorySlug)}>
            {(Object.keys(CATEGORIES) as CategorySlug[]).map((c) => (
              <option key={c} value={c}>{CATEGORIES[c].en} — {CATEGORIES[c].bn}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls}>প্রকাশের তারিখ</label>
          <input className={field} type="date" value={f.publishedAt} onChange={(e) => set('publishedAt', e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>ট্যাগ (কমা দিয়ে)</label>
          <input className={field} value={f.tags} onChange={(e) => set('tags', e.target.value)} placeholder="Offers, Products" />
        </div>
        <div>
          <label className={labelCls}>URL slug (ইংরেজিতে; খালি রাখলে শিরোনাম থেকে হবে)</label>
          <input className={field} value={f.slug} onChange={(e) => set('slug', e.target.value)} />
        </div>
      </div>

      <MediaPicker label="কভার ছবি" kind="image" value={f.coverImage} onChange={(u) => set('coverImage', u)} hint="JPG/PNG/WEBP, সর্বোচ্চ ১০MB" />
      <GalleryPicker value={f.images} onChange={(urls) => set('images', urls)} />
      <MediaPicker label="ভিডিও (ঐচ্ছিক)" kind="video" value={f.videoUrl} onChange={(u) => set('videoUrl', u)} hint="MP4/WEBM সর্বোচ্চ ২০০MB, অথবা YouTube লিংক বসান (বড় ভিডিওর জন্য YouTube সাশ্রয়ী)" />

      <div className="flex flex-wrap gap-5 text-sm font-bold text-slate-700">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={f.published} onChange={(e) => set('published', e.target.checked)} /> প্রকাশিত (বন্ধ থাকলে ড্রাফট)
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={f.featured} onChange={(e) => set('featured', e.target.checked)} /> Featured
        </label>
      </div>

      {err && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-bold text-red-700">{err}</p>}

      <div className="flex gap-3">
        <button disabled={busy} className={`${btn} bg-blue-600 text-white hover:bg-blue-700`}>
          {busy ? 'সেভ হচ্ছে...' : props.submitLabel}
        </button>
        <button type="button" onClick={props.onCancel} className={`${btn} border border-slate-300 bg-white hover:bg-slate-100`}>
          বাতিল
        </button>
      </div>
    </form>
  );
}

const payloadFrom = (f: FormState, forCreate: boolean) => ({
  ...f,
  slug: forCreate && !f.slug.trim() ? undefined : f.slug.trim(),
});

/* ---------------- Manager ---------------- */
export default function BlogManager({ notify }: { notify: (m: string) => void }) {
  const [posts, setPosts] = useState<AdminBlogPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    const r = await api<{ posts: AdminBlogPost[] }>('/api/admin/blog');
    setLoading(false);
    if (r.success) setPosts(r.posts);
    else notify(r.error ?? 'ব্লগ লোড হয়নি');
  }, [notify]);

  useEffect(() => {
    void load();
  }, [load]);

  const replace = (np: AdminBlogPost) => setPosts((list) => list.map((x) => (x.id === np.id ? np : x)));

  async function togglePublished(p: AdminBlogPost) {
    const r = await api<{ post: AdminBlogPost }>(`/api/admin/blog/${p.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ published: !p.published }),
    });
    if (r.success) {
      replace(r.post);
      notify(r.post.published ? 'প্রকাশিত হয়েছে' : 'ড্রাফটে নেওয়া হয়েছে');
    } else notify(r.error ?? 'আপডেট হয়নি');
  }

  async function remove(p: AdminBlogPost) {
    if (!confirm(`"${p.title.en}" মুছে ফেলবেন? এটা ফেরানো যাবে না। (শুধু লুকাতে চাইলে ড্রাফটে নিন)`)) return;
    const r = await api<object>(`/api/admin/blog/${p.id}`, { method: 'DELETE' });
    if (r.success) {
      setPosts((list) => list.filter((x) => x.id !== p.id));
      notify('মুছে ফেলা হয়েছে');
    } else notify(r.error ?? 'মোছা যায়নি');
  }

  const q = search.trim().toLowerCase();
  const shown = q
    ? posts.filter((p) => [p.title.en, p.title.bn, p.slug].join(' ').toLowerCase().includes(q))
    : posts;

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <input className={`${field} max-w-sm`} placeholder="শিরোনাম, slug দিয়ে খুঁজুন" value={search} onChange={(e) => setSearch(e.target.value)} />
        <button onClick={() => { setShowNew((v) => !v); setEditingId(null); }} className={`${btn} bg-blue-600 text-white hover:bg-blue-700`}>
          {showNew ? 'বন্ধ করুন' : '+ নতুন ব্লগ পোস্ট'}
        </button>
        <button onClick={() => void load()} className={`${btn} border border-slate-300 bg-white hover:bg-slate-100`}>রিফ্রেশ</button>
        <span className="self-center text-sm text-slate-500">মোট {posts.length}টি</span>
      </div>

      {showNew && (
        <BlogForm
          initial={emptyForm()}
          submitLabel="পোস্ট সেভ করুন"
          onCancel={() => setShowNew(false)}
          onSubmit={async (f) => {
            const r = await api<{ post: AdminBlogPost }>('/api/admin/blog', {
              method: 'POST',
              body: JSON.stringify(payloadFrom(f, true)),
            });
            if (!r.success) return r.error ?? 'সেভ হয়নি';
            setPosts((list) => [r.post, ...list]);
            setShowNew(false);
            notify('পোস্ট যোগ হয়েছে');
            return null;
          }}
        />
      )}

      {loading && posts.length === 0 ? (
        <p className="py-10 text-center font-bold text-slate-500">লোড হচ্ছে...</p>
      ) : shown.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-300 py-12 text-center text-slate-500">
          {posts.length === 0 ? 'এখনো কোনো ব্লগ পোস্ট নেই। "+ নতুন ব্লগ পোস্ট" দিয়ে শুরু করুন।' : 'কিছু পাওয়া যায়নি'}
        </p>
      ) : (
        <div className="space-y-3">
          {shown.map((p) => (
            <div key={p.id} className={`rounded-2xl border bg-white p-4 shadow-sm ${p.published ? 'border-slate-200' : 'border-amber-300 bg-amber-50/40'}`}>
              <div className="flex flex-wrap items-center gap-4">
                {p.coverImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.coverImage} alt="" className="h-16 w-24 rounded-xl bg-slate-100 object-cover" />
                ) : (
                  <div className="flex h-16 w-24 items-center justify-center rounded-xl bg-slate-100 text-2xl" aria-hidden="true">📰</div>
                )}
                <div className="min-w[45px flex-1">
                  <p className="font-bold text-slate-900">{p.title.en}</p>
                  <p className="text-sm text-slate-600">{p.title.bn}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {CATEGORIES[p.category].bn} · {p.dateISO} · /blog/{p.slug}
                    {p.videoUrl && <b className="ml-2 text-blue-700">▶ ভিডিও</b>}
                    {(p.images?.length ?? 0) > 0 && <b className="ml-2 text-blue-700">🖼 {p.images?.length}</b>}
                    <b className={`ml-2 ${p.published ? 'text-green-700' : 'text-amber-700'}`}>{p.published ? 'প্রকাশিত' : 'ড্রাফট'}</b>
                    {p.featured && <b className="ml-2 text-purple-700">Featured</b>}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => setEditingId(editingId === p.id ? null : (p.id ?? null))} className={`${btn} border border-slate-300 hover:bg-slate-100`}>সম্পাদনা</button>
                  <button onClick={() => void togglePublished(p)} className={`${btn} border border-slate-300 hover:bg-slate-100`}>{p.published ? 'ড্রাফটে নিন' : 'প্রকাশ করুন'}</button>
                  {p.published && (
                    <a href={`/blog/${p.slug}`} target="_blank" rel="noreferrer" className={`${btn} border border-slate-300 hover:bg-slate-100`}>দেখুন</a>
                  )}
                  <button onClick={() => void remove(p)} className={`${btn} bg-red-50 text-red-700 hover:bg-red-100`}>মুছুন</button>
                </div>
              </div>

              {editingId === p.id && (
                <div className="mt-4">
                  <BlogForm
                    initial={fromPost(p)}
                    submitLabel="পরিবর্তন সেভ করুন"
                    onCancel={() => setEditingId(null)}
                    onSubmit={async (f) => {
                      const r = await api<{ post: AdminBlogPost }>(`/api/admin/blog/${p.id}`, {
                        method: 'PATCH',
                        body: JSON.stringify(payloadFrom(f, false)),
                      });
                      if (!r.success) return r.error ?? 'সেভ হয়নি';
                      replace(r.post);
                      setEditingId(null);
                      notify('সেভ হয়েছে');
                      return null;
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}