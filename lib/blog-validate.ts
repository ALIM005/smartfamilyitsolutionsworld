// lib/blog-validate.ts — server-side validation/sanitising of blog input (never trust the browser)
import { CATEGORIES } from '@/lib/blog';
import type { CategorySlug } from '@/lib/blog';

export type Parsed = { ok: true; data: Record<string, unknown> } | { ok: false; error: string };

const str = (v: unknown, max: number): string => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const has = (o: Record<string, unknown>, k: string): boolean => Object.prototype.hasOwnProperty.call(o, k);

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

// Only https links are accepted (blocks javascript:, data:, http:)
function httpsUrl(raw: string): string | null {
  try {
    const u = new URL(raw);
    return u.protocol === 'https:' ? u.toString() : null;
  } catch {
    return null;
  }
}

export function parseBlogInput(body: unknown, mode: 'create' | 'update'): Parsed {
  if (!body || typeof body !== 'object') return { ok: false, error: 'ডেটা সঠিক নয়' };
  const b = body as Record<string, unknown>;
  const d: Record<string, unknown> = {};

  const text = (key: string, max: number): void => {
    if (mode === 'create' || has(b, key)) d[key] = str(b[key], max);
  };
  text('titleEn', 200);
  text('titleBn', 200);
  text('excerptEn', 500);
  text('excerptBn', 500);
  text('contentEn', 20000);
  text('contentBn', 20000);

  if (has(d, 'titleEn') || has(d, 'titleBn')) {
    const en = String(d.titleEn ?? '');
    const bn = String(d.titleBn ?? '');
    if (!en && !bn) return { ok: false, error: 'শিরোনাম (English বা বাংলা) দিন' };
    d.titleEn = en || bn;
    d.titleBn = bn || en;
  }

  if (mode === 'create' || has(b, 'category')) {
    const c = str(b.category, 30) || 'update';
    if (!(c in CATEGORIES)) return { ok: false, error: 'ক্যাটেগরি সঠিক নয়' };
    d.category = c as CategorySlug;
  }

  if (mode === 'create' || has(b, 'tags')) {
    const raw = Array.isArray(b.tags) ? b.tags : str(b.tags, 600).split(',');
    d.tags = [...new Set(raw.map((t) => str(t, 30).replace(/^#/, '')).filter(Boolean))].slice(0, 12);
  }

  if (mode === 'create' || has(b, 'publishedAt')) {
    const v = str(b.publishedAt, 10);
    if (v && !/^\d{4}-\d{2}-\d{2}$/.test(v)) return { ok: false, error: 'তারিখ সঠিক নয়' };
    d.publishedAt = v ? new Date(`${v}T00:00:00Z`) : new Date();
  }

  if (mode === 'create' || has(b, 'readMinutes')) {
    const n = Math.round(Number(b.readMinutes));
    const words = `${d.contentEn ?? ''} ${d.contentBn ?? ''}`.split(/\s+/).filter(Boolean).length;
    d.readMinutes = Number.isFinite(n) && n > 0 ? Math.min(n, 60) : Math.max(1, Math.ceil(words / 180));
  }

  if (mode === 'create' || has(b, 'featured')) d.featured = b.featured === true;
  if (mode === 'create' || has(b, 'published')) d.published = b.published === true;

  for (const key of ['coverImage', 'videoUrl'] as const) {
    if (mode === 'create' || has(b, key)) {
      const raw = str(b[key], 600);
      if (!raw) d[key] = '';
      else {
        const ok = httpsUrl(raw);
        if (!ok) return { ok: false, error: 'লিংক অবশ্যই https:// দিয়ে শুরু হতে হবে' };
        d[key] = ok;
      }
    }
  }

  if (mode === 'create' || has(b, 'images')) {
    const list = Array.isArray(b.images) ? b.images : [];
    const urls: string[] = [];
    for (const item of list.slice(0, 12)) {
      const ok = httpsUrl(str(item, 600));
      if (!ok) return { ok: false, error: 'গ্যালারির ছবির লিংক সঠিক নয়' };
      urls.push(ok);
    }
    d.images = urls;
  }

  if (mode === 'create') {
    d.slug = slugify(str(b.slug, 120)) || slugify(String(d.titleEn)) || `post-${Date.now().toString(36)}`;
  } else if (has(b, 'slug')) {
    const s = slugify(str(b.slug, 120));
    if (s) d.slug = s;
  }

  return { ok: true, data: d };
}