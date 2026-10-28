// app/api/admin/products/[id]/route.ts
// PATCH  → দাম, ডিসকাউন্ট, স্টক ইত্যাদি যেকোনো ফিল্ড বদলানো (শুধু পাঠানো ফিল্ড)
//          stockDelta: +/- সংখ্যা পাঠালে স্টক যোগ/বিয়োগ হয় (চলমান অর্ডারের সাথে সংঘর্ষ ছাড়া)
// DELETE → প্রোডাক্ট মুছে ফেলা (পুরনো অর্ডারে নাম ও দাম সংরক্ষিত থাকে)
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { requireAdmin } from '@/lib/admin-auth';
import { connectMongo } from '@/lib/mongo';
import Product from '@/models/Product';
import { parseProductInput } from '@/lib/product-input';
import { toProduct, type ProductLike } from '@/lib/serialize';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type Ctx = { params: Promise<{ id: string }> | { id: string } };
const OBJECT_ID = /^[a-f0-9]{24}$/i;

function bad(error: string, status = 400) {
  return NextResponse.json({ success: false, error }, { status });
}

export async function PATCH(req: Request, ctx: Ctx) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const { id } = await ctx.params;
  if (!OBJECT_ID.test(id)) return bad('অবৈধ আইডি');

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return bad('অবৈধ ডেটা');
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) return bad('অবৈধ ডেটা');

  const raw = body as Record<string, unknown>;
  const parsed = parseProductInput(raw, true);
  if (!parsed.ok) return bad(parsed.error);

  const set: Record<string, unknown> = { ...parsed.data };
  const update: Record<string, unknown> = {};
  const filter: Record<string, unknown> = { _id: new mongoose.Types.ObjectId(id) };

  if (set.sku === '') {
    delete set.sku;
    update.$unset = { sku: 1 };
  }

  if (raw.stockDelta !== undefined) {
    const delta = Number(raw.stockDelta);
    if (!Number.isInteger(delta) || delta === 0 || Math.abs(delta) > 1_000_000) return bad('stockDelta পূর্ণসংখ্যা হতে হবে');
    if (set.stock !== undefined) return bad('stock ও stockDelta একসাথে দেবেন না');
    update.$inc = { stock: delta };
    if (delta < 0) filter.stock = { $gte: -delta }; // স্টক ঋণাত্মক হতে দেওয়া হবে না
  }

  if (Object.keys(set).length > 0) update.$set = set;
  if (Object.keys(update).length === 0) return bad('কিছু বদলানোর নেই');

  try {
    await connectMongo();
    const doc = await Product.findOneAndUpdate(filter, update, { new: true, runValidators: true }).lean();
    if (!doc) {
      const exists = await Product.exists({ _id: new mongoose.Types.ObjectId(id) });
      return exists ? bad('স্টক এর চেয়ে বেশি কমানো যাবে না', 409) : bad('প্রোডাক্ট পাওয়া যায়নি', 404);
    }
    return NextResponse.json({ success: true, product: toProduct(doc as unknown as ProductLike) });
  } catch (error) {
    if ((error as { code?: number }).code === 11000) return bad('এই SKU বা slug আগে থেকেই আছে', 409);
    console.error('[admin products PATCH]', error);
    return bad('আপডেট করা যায়নি', 500);
  }
}

export async function DELETE(req: Request, ctx: Ctx) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const { id } = await ctx.params;
  if (!OBJECT_ID.test(id)) return bad('অবৈধ আইডি');

  try {
    await connectMongo();
    const res = await Product.deleteOne({ _id: new mongoose.Types.ObjectId(id) });
    if (res.deletedCount !== 1) return bad('প্রোডাক্ট পাওয়া যায়নি', 404);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[admin products DELETE]', error);
    return bad('মুছে ফেলা যায়নি', 500);
  }
}
