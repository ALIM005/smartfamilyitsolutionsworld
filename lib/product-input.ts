// lib/product-input.ts
// Validates and cleans the product data sent by the admin. Nothing coming from the client is trusted.


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


// If partial=true (for edit), only the sent fields are validated; if false (for a new product), required fields are needed
export function parseProductInput(body: unknown, partial: boolean): ParseResult {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { ok: false, error: 'Invalid data' };
  }
  const b = body as Record<string, unknown>;
  const data: ProductInput = {};


  const need = (key: string) => !partial && b[key] === undefined;
  if (need('name') || need('price') || need('category') || need('image')) {
    return { ok: false, error: 'Name, price, category, and image link must be provided' };
  }


  if (b.name !== undefined) {
    if (typeof b.name !== 'string' || !b.name.trim() || b.name.trim().length > 200) {
      return { ok: false, error: 'The name must be 1–200 characters' };
    }
    data.name = b.name.trim();
  }


  if (b.slug !== undefined && b.slug !== '') {
    if (typeof b.slug !== 'string') return { ok: false, error: 'Invalid slug' };
    const s = slugify(b.slug);
    if (!s) return { ok: false, error: 'The slug must contain English letters or numbers' };
    data.slug = s;
  }


  if (b.sku !== undefined) {
    if (typeof b.sku !== 'string' || b.sku.trim().length > 60) return { ok: false, error: 'Invalid SKU' };
    data.sku = b.sku.trim().toUpperCase();
  }


  if (b.image !== undefined) {
    if (typeof b.image !== 'string' || !validImage(b.image.trim()) || b.image.trim().length > 1000) {
      return { ok: false, error: 'The image link must start with https://' };
    }
    data.image = b.image.trim();
  }


  if (b.category !== undefined) {
    if (typeof b.category !== 'string' || !b.category.trim() || b.category.trim().length > 60) {
      return { ok: false, error: 'The category must be 1–60 characters' };
    }
    data.category = b.category.trim();
  }


  if (b.brand !== undefined) {
    if (typeof b.brand !== 'string' || b.brand.trim().length > 60) return { ok: false, error: 'Invalid brand' };
    data.brand = b.brand.trim();
  }


  if (b.price !== undefined) {
    const n = toNumber(b.price);
    if (n === null || n < 0 || n > MAX_PRICE) return { ok: false, error: `The price must be between 0 and ${MAX_PRICE}` };
    data.price = Math.round(n * 100) / 100;
  }


  if (b.discount !== undefined) {
    const n = toNumber(b.discount);
    if (n === null || n < 0 || n > 90) return { ok: false, error: 'The discount must be between 0–90%' };
    data.discount = Math.round(n * 100) / 100;
  }


  if (b.stock !== undefined) {
    const n = toNumber(b.stock);
    if (n === null || !Number.isInteger(n) || n < 0 || n > MAX_STOCK) {
      return { ok: false, error: 'Stock must be an integer (0 or more)' };
    }
    data.stock = n;
  }


  if (b.rating !== undefined) {
    const n = toNumber(b.rating);
    if (n === null || n < 0 || n > 5) return { ok: false, error: 'The rating must be between 0–5' };
    data.rating = Math.round(n * 10) / 10;
  }


  for (const key of ['colors', 'sizes', 'tags'] as const) {
    if (b[key] !== undefined) {
      const list = toList(b[key], 20, 40);
      if (list === null) return { ok: false, error: `The ${key} list is invalid` };
      data[key] = list;
    }
  }


  for (const key of ['featured', 'flashSale', 'active'] as const) {
    if (b[key] !== undefined) {
      if (typeof b[key] !== 'boolean') return { ok: false, error: `${key} must be true/false` };
      data[key] = b[key] as boolean;
    }
  }


  return { ok: true, data };
}