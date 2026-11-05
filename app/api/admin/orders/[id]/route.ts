// app/api/admin/orders/[id]/route.ts
// PATCH { status?, paymentStatus? }
//  - When cancelled, stock is returned (only once, not double-restored)
//  - Cancelled or Delivered orders can no longer be cancelled, and the status of a Cancelled order no longer changes
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
  if (!OBJECT_ID.test(id)) return bad('Invalid ID');


  let body: Record<string, unknown>;
  try {
    const parsed: unknown = await req.json();
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return bad('Invalid data');
    body = parsed as Record<string, unknown>;
  } catch {
    return bad('Invalid data');
  }


  const status = typeof body.status === 'string' ? body.status : undefined;
  const paymentStatus = typeof body.paymentStatus === 'string' ? body.paymentStatus : undefined;


  if (status && !(ORDER_STATUSES as readonly string[]).includes(status)) return bad('Invalid status');
  if (paymentStatus && !(PAYMENT_STATUSES as readonly string[]).includes(paymentStatus)) return bad('Invalid payment status');
  if (!status && !paymentStatus) return bad('Nothing to change');


  const oid = new mongoose.Types.ObjectId(id);


  try {
    await connectMongo();


    if (status === 'Cancelled') {
      // Conditional update: only an order that is not yet Cancelled/Delivered can be cancelled
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
        return exists ? bad('This order can no longer be cancelled', 409) : bad('Order not found', 404);
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
      return exists ? bad('A Cancelled order can no longer be changed', 409) : bad('Order not found', 404);
    }
    return NextResponse.json({ success: true, status: updated.status, paymentStatus: updated.paymentStatus });
  } catch (error) {
    console.error('[admin orders PATCH]', error);
    return bad('Could not be updated', 500);
  }
}