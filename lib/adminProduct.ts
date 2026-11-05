type Raw = Record<string, unknown>;


export const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || `item-${Date.now()}`;


const list = (v: unknown) =>
  (Array.isArray(v) ? v.map(String) : String(v ?? '').split(','))
    .map((x) => x.trim())
    .filter(Boolean);


const num = (v: unknown) => (v === '' || v === null || v === undefined ? NaN : Number(v));


export function parseProductInput(body: Raw, create: boolean): { data: Raw } | { error: string } {
  const d: Raw = {};


  if (create || 'name' in body) {
    const name = String(body.name ?? '').trim();
    if (!name) return { error: 'Provide a name' };
    d.name = name;
  }
  if (create || 'image' in body) {
    const image = String(body.image ?? '').trim();
    if (!/^https?:\/\//i.test(image) && !image.startsWith('/')) return { error: 'The image link must start with https://' };
    d.image = image;
  }
  if (create || 'category' in body) {
    const c = String(body.category ?? '').trim();
    if (!c) return { error: 'Provide a category' };
    d.category = c;
  }
  if (create || 'price' in body) {
    const p = num(body.price);
    if (!Number.isFinite(p) || p < 0) return { error: 'Provide a valid price' };
    d.price = p;
  }
  if ('discount' in body) {
    const x = num(body.discount);
    if (!Number.isFinite(x) || x < 0 || x > 90) return { error: 'The discount must be 0–90%' };
    d.discount = x;
  }
  if ('stock' in body) {
    const x = num(body.stock);
    if (!Number.isInteger(x) || x < 0) return { error: 'Stock must be an integer' };
    d.stock = x;
  }
  if ('rating' in body) {
    const x = num(body.rating);
    if (!Number.isFinite(x) || x < 0 || x > 5) return { error: 'The rating must be 0–5' };
    d.rating = x;
  }
  for (const k of ['brand', 'sku'] as const) if (k in body) d[k] = String(body[k] ?? '').trim();
  for (const k of ['colors', 'sizes', 'tags'] as const) if (k in body) d[k] = list(body[k]);
  for (const k of ['featured', 'flashSale', 'active'] as const) if (k in body) d[k] = Boolean(body[k]);
  if ('slug' in body) {
    const s = String(body.slug ?? '').trim();
    if (s) d.slug = slugify(s);
  }
  return { data: d };
}


export function serializeProduct(p: Raw) {
  const price = Number(p.price) || 0;
  const discount = Number(p.discount) || 0;
  return {
    id: String(p._id),
    name: p.name, slug: p.slug, sku: p.sku ?? '', image: p.image,
    category: p.category, brand: p.brand ?? '',
    price, discount,
    finalPrice: Math.round(price * (1 - discount / 100) * 100) / 100,
    stock: p.stock ?? 0, sold: p.sold ?? 0, rating: p.rating ?? 0,
    colors: p.colors ?? [], sizes: p.sizes ?? [], tags: p.tags ?? [],
    featured: !!p.featured, flashSale: !!p.flashSale, active: p.active !== false,
  };
}