// app/api/admin/products/route.ts
// GET  → সব প্রোডাক্ট (নিষ্ক্রিয় সহ)
// POST → নতুন প্রোডাক্ট
import { randomBytes } from 'crypto';
import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { connectMongo } from '@/lib/mongo';
import Product from '@/models/Product';
import { parseProductInput, slugify } from '@/lib/product-input';
import { toProduct, type ProductLike } from '@/lib/serialize';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: Request) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  try {
    await connectMongo();
    const docs = await Product.find({}).sort({ createdAt: -1 }).limit(2000).lean();
    return NextResponse.json({ success: true, products: (docs as unknown as ProductLike[]).map(toProduct) });
  } catch (error) {
    console.error('[admin products GET]', error);
    return NextResponse.json({ success: false, error: 'ডেটা লোড করা যায়নি' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: 'অবৈধ ডেটা' }, { status: 400 });
  }

  const parsed = parseProductInput(body, false);
  if (!parsed.ok) return NextResponse.json({ success: false, error: parsed.error }, { status: 400 });
  const data = { ...parsed.data };

  try {
    await connectMongo();

    // slug অনন্য রাখা
    const base = data.slug || slugify(data.name ?? '') || 'product';
    let slug = base;
    for (let i = 0; i < 5 && (await Product.exists({ slug })); i++) {
      slug = `${base}-${randomBytes(2).toString('hex')}`;
    }
    data.slug = slug;

    // খালি SKU সেভ করলে unique ইনডেক্সে সংঘর্ষ হয়, তাই বাদ
    if (!data.sku) delete data.sku;

    const created = await Product.create({ stock: 0, discount: 0, active: true, ...data });
    return NextResponse.json({ success: true, product: toProduct(created.toObject() as unknown as ProductLike) });
  } catch (error) {
    if ((error as { code?: number }).code === 11000) {
      return NextResponse.json({ success: false, error: 'এই SKU বা slug আগে থেকেই আছে' }, { status: 409 });
    }
    console.error('[admin products POST]', error);
    return NextResponse.json({ success: false, error: 'প্রোডাক্ট সেভ করা যায়নি' }, { status: 500 });
  }
}
