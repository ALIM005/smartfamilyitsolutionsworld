// app/api/admin/orders/[id]/route.ts
// PATCH { status?, paymentStatus? }
//  - Cancelled করলে স্টক ফেরত যায় (একবারই, ডাবল-রিস্টোর হয় না)
//  - Cancelled বা Delivered অর্ডার আর Cancel করা যায় না, Cancelled অর্ডারের স্ট্যাটাস আর বদলায় না
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { requireAdmin } from '@/lib/admin-auth';
import { connectMongo } from '@/lib/mongo';
import Order, { ORDER_STATUSES } from '@/models/Order';
import Product from '@/models/Product';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type Ctx = { params: Promise<{ id: string }> | { id: string } };
const OBJECT_ID = /^[a-f0-9]{24}$/i;
const PAYMENT_STATUSES = ['Unpaid', 'Paid', 'Refunded'] as const;

function bad(error: string, status = 400) {
  return NextResponse.json({ success: false, error }, { status });
}

export async function PATCH(req: Request, ctx: Ctx) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const { id } = await ctx.params;
  if (!OBJECT_ID.test(id)) return bad('অবৈধ আইডি');

  let body: Record<string, unknown>;
  try {
    const parsed: unknown = await req.json();
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return bad('অবৈধ ডেটা');
    body = parsed as Record<string, unknown>;
  } catch {
    return bad('অবৈধ ডেটা');
  }

  const status = typeof body.status === 'string' ? body.status : undefined;
  const paymentStatus = typeof body.paymentStatus === 'string' ? body.paymentStatus : undefined;

  if (status && !(ORDER_STATUSES as readonly string[]).includes(status)) return bad('অবৈধ স্ট্যাটাস');
  if (paymentStatus && !(PAYMENT_STATUSES as readonly string[]).includes(paymentStatus)) return bad('অবৈধ পেমেন্ট স্ট্যাটাস');
  if (!status && !paymentStatus) return bad('কিছু বদলানোর নেই');

  const oid = new mongoose.Types.ObjectId(id);

  try {
    await connectMongo();

    if (status === 'Cancelled') {
      // শর্ত সহ আপডেট: শুধু যে অর্ডার এখনো Cancelled/Delivered নয়, তাকেই Cancel করা যাবে
      const cancelled = await Order.findOneAndUpdate(
        { _id: oid, status: { $nin: ['Cancelled', 'Delivered'] } },
        {
          $set: { status: 'Cancelled', ...(paymentStatus ? { paymentStatus } : {}) },
          $push: { statusHistory: { status: 'Cancelled', at: new Date() } },
        },
        { new: true }
      ).lean();

      if (!cancelled) {
        const exists = await Order.exists({ _id: oid });
        return exists ? bad('এই অর্ডার আর Cancel করা যাবে না', 409) : bad('অর্ডার পাওয়া যায়নি', 404);
      }

      for (const item of cancelled.items) {
        await Product.updateOne({ _id: item.product }, { $inc: { stock: item.quantity, sold: -item.quantity } });
      }
      return NextResponse.json({ success: true, status: cancelled.status, paymentStatus: cancelled.paymentStatus });
    }

    const set: Record<string, string> = {};
    if (status) set.status = status;
    if (paymentStatus) set.paymentStatus = paymentStatus;

    const update: Record<string, unknown> = { $set: set };
    if (status) update.$push = { statusHistory: { status, at: new Date() } };

    const updated = await Order.findOneAndUpdate({ _id: oid, status: { $ne: 'Cancelled' } }, update, { new: true }).lean();
    if (!updated) {
      const exists = await Order.exists({ _id: oid });
      return exists ? bad('Cancelled অর্ডার আর বদলানো যায় না', 409) : bad('অর্ডার পাওয়া যায়নি', 404);
    }
    return NextResponse.json({ success: true, status: updated.status, paymentStatus: updated.paymentStatus });
  } catch (error) {
    console.error('[admin orders PATCH]', error);
    return bad('আপডেট করা যায়নি', 500);
  }
}
