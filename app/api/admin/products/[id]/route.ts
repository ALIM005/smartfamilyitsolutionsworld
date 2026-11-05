// app/api/admin/products/[id]/route.ts
// PATCH  → Change any field such as price, discount, stock, etc. (only the sent fields)
//          stockDelta: sending a +/- number adds/subtracts stock (without conflict with ongoing orders)
// DELETE → Delete product (name and price remain preserved in old orders)
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
  if (!OBJECT_ID.test(id)) return bad('Invalid ID');


  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return bad('Invalid data');
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) return bad('Invalid data');


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
    if (!Number.isInteger(delta) || delta === 0 || Math.abs(delta) > 1_000_000) return bad('stockDelta must be an integer');
    if (set.stock !== undefined) return bad('Do not provide stock and stockDelta together');
    update.$inc = { stock: delta };
    if (delta < 0) filter.stock = { $gte: -delta }; // Stock must not be allowed to become negative
  }


  if (Object.keys(set).length > 0) update.$set = set;
  if (Object.keys(update).length === 0) return bad('Nothing to change');


  try {
    await connectMongo();
    const doc = await Product.findOneAndUpdate(filter, update, { new: true, runValidators: true }).lean();
    if (!doc) {
      const exists = await Product.exists({ _id: new mongoose.Types.ObjectId(id) });
      return exists ? bad('Stock cannot be reduced by more than the available stock', 409) : bad('Product not found', 404);
    }
    return NextResponse.json({ success: true, product: toProduct(doc as unknown as ProductLike) });
  } catch (error) {
    if ((error as { code?: number }).code === 11000) return bad('This SKU or slug already exists', 409);
    console.error('[admin products PATCH]', error);
    return bad('Could not be updated', 500);
  }
}


export async function DELETE(req: Request, ctx: Ctx) {
  const denied = requireAdmin(req);
  if (denied) return denied;


  const { id } = await ctx.params;
  if (!OBJECT_ID.test(id)) return bad('Invalid ID');


  try {
    await connectMongo();
    const res = await Product.deleteOne({ _id: new mongoose.Types.ObjectId(id) });
    if (res.deletedCount !== 1) return bad('Product not found', 404);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[admin products DELETE]', error);
    return bad('Could not be deleted', 500);
  }
}