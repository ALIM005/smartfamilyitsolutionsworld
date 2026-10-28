// lib/product-input.ts
// অ্যাডমিনের পাঠানো প্রোডাক্ট ডেটা যাচাই ও পরিষ্কার করে। ক্লায়েন্ট থেকে আসা কিছুই বিশ্বাস করা হয় না।

export type ProductInput = {
  name?: string;
  slug?: string;
  sku?: string;
  image?: string;
  category?: string;
  brand?: string;
  price?: number;
  discount?: number;
  stock?: number;
  rating?: number;
  colors?: string[];
  sizes?: string[];
  tags?: string[];
  featured?: boolean;
  flashSale?: boolean;
  active?: boolean;
};

export type ParseResult = { ok: true; data: ProductInput } | { ok: false; error: string };

const MAX_PRICE = 10_000_000;
const MAX_STOCK = 1_000_000;

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function toList(value: unknown, maxItems: number, maxLen: number): string[] | null {
  let arr: unknown[];
  if (Array.isArray(value)) arr = value;
  else if (typeof value === 'string') arr = value.split(',');
  else return null;
  const out: string[] = [];
  for (const item of arr) {
    if (typeof item !== 'string') continue;
    const v = item.trim().slice(0, maxLen);
    if (v && !out.includes(v)) out.push(v);
    if (out.length >= maxItems) break;
  }
  return out;
}

function toNumber(value: unknown): number | null {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  if (typeof value === 'string' && value.trim() !== '') {
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function validImage(url: string): boolean {
  if (url.startsWith('/') && !url.startsWith('//')) return true;
  try {
    const u = new URL(url);
    return u.protocol === 'https:' || u.protocol === 'http:';
  } catch {
    return false;
  }
}

// partial=true হলে (এডিটে) শুধু পাঠানো ফিল্ডগুলো যাচাই হয়; false হলে (নতুন প্রোডাক্টে) বাধ্যতামূলক ফিল্ড লাগে
export function parseProductInput(body: unknown, partial: boolean): ParseResult {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { ok: false, error: 'অবৈধ ডেটা' };
  }
  const b = body as Record<string, unknown>;
  const data: ProductInput = {};

  const need = (key: string) => !partial && b[key] === undefined;
  if (need('name') || need('price') || need('category') || need('image')) {
    return { ok: false, error: 'নাম, দাম, ক্যাটেগরি ও ছবির লিংক দিতে হবে' };
  }

  if (b.name !== undefined) {
    if (typeof b.name !== 'string' || !b.name.trim() || b.name.trim().length > 200) {
      return { ok: false, error: 'নাম ১–২০০ অক্ষরের হতে হবে' };
    }
    data.name = b.name.trim();
  }

  if (b.slug !== undefined && b.slug !== '') {
    if (typeof b.slug !== 'string') return { ok: false, error: 'অবৈধ slug' };
    const s = slugify(b.slug);
    if (!s) return { ok: false, error: 'slug-এ ইংরেজি অক্ষর বা সংখ্যা থাকতে হবে' };
    data.slug = s;
  }

  if (b.sku !== undefined) {
    if (typeof b.sku !== 'string' || b.sku.trim().length > 60) return { ok: false, error: 'অবৈধ SKU' };
    data.sku = b.sku.trim().toUpperCase();
  }

  if (b.image !== undefined) {
    if (typeof b.image !== 'string' || !validImage(b.image.trim()) || b.image.trim().length > 1000) {
      return { ok: false, error: 'ছবির লিংক https:// দিয়ে শুরু হতে হবে' };
    }
    data.image = b.image.trim();
  }

  if (b.category !== undefined) {
    if (typeof b.category !== 'string' || !b.category.trim() || b.category.trim().length > 60) {
      return { ok: false, error: 'ক্যাটেগরি ১–৬০ অক্ষরের হতে হবে' };
    }
    data.category = b.category.trim();
  }

  if (b.brand !== undefined) {
    if (typeof b.brand !== 'string' || b.brand.trim().length > 60) return { ok: false, error: 'অবৈধ ব্র্যান্ড' };
    data.brand = b.brand.trim();
  }

  if (b.price !== undefined) {
    const n = toNumber(b.price);
    if (n === null || n < 0 || n > MAX_PRICE) return { ok: false, error: `দাম ০ থেকে ${MAX_PRICE} এর মধ্যে হতে হবে` };
    data.price = Math.round(n * 100) / 100;
  }

  if (b.discount !== undefined) {
    const n = toNumber(b.discount);
    if (n === null || n < 0 || n > 90) return { ok: false, error: 'ডিসকাউন্ট ০–৯০% এর মধ্যে হতে হবে' };
    data.discount = Math.round(n * 100) / 100;
  }

  if (b.stock !== undefined) {
    const n = toNumber(b.stock);
    if (n === null || !Number.isInteger(n) || n < 0 || n > MAX_STOCK) {
      return { ok: false, error: 'স্টক পূর্ণসংখ্যা (০ বা বেশি) হতে হবে' };
    }
    data.stock = n;
  }

  if (b.rating !== undefined) {
    const n = toNumber(b.rating);
    if (n === null || n < 0 || n > 5) return { ok: false, error: 'রেটিং ০–৫ এর মধ্যে হতে হবে' };
    data.rating = Math.round(n * 10) / 10;
  }

  for (const key of ['colors', 'sizes', 'tags'] as const) {
    if (b[key] !== undefined) {
      const list = toList(b[key], 20, 40);
      if (list === null) return { ok: false, error: `${key} তালিকা অবৈধ` };
      data[key] = list;
    }
  }

  for (const key of ['featured', 'flashSale', 'active'] as const) {
    if (b[key] !== undefined) {
      if (typeof b[key] !== 'boolean') return { ok: false, error: `${key} true/false হতে হবে` };
      data[key] = b[key] as boolean;
    }
  }

  return { ok: true, data };
}
