// app/api/admin/orders/route.ts
// GET ?status=Pending&q=017...&limit=50&skip=0 → অর্ডার তালিকা (নতুন আগে)
import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { connectMongo } from '@/lib/mongo';
import Order, { ORDER_STATUSES } from '@/models/Order';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: Request) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const url = new URL(req.url);
  const status = url.searchParams.get('status') ?? '';
  const q = (url.searchParams.get('q') ?? '').trim().slice(0, 40);
  const limit = Math.min(100, Math.max(1, Number(url.searchParams.get('limit')) || 50));
  const skip = Math.max(0, Number(url.searchParams.get('skip')) || 0);

  const filter: Record<string, unknown> = {};
  if (status) {
    if (!(ORDER_STATUSES as readonly string[]).includes(status)) {
      return NextResponse.json({ success: false, error: 'অবৈধ স্ট্যাটাস' }, { status: 400 });
    }
    filter.status = status;
  }
  if (q) {
    // ফোন বা অর্ডার নম্বর, রেগেক্স ইনজেকশন এড়াতে অক্ষর escape
    const safe = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    filter.$or = [
      { orderNumber: new RegExp(`^${safe}`, 'i') },
      { 'customer.phone': new RegExp(`${safe}$`) },
    ];
  }

  try {
    await connectMongo();
    const [docs, total] = await Promise.all([
      Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Order.countDocuments(filter),
    ]);

    const orders = docs.map((o) => ({
      id: o._id.toString(),
      orderNumber: o.orderNumber,
      customer: o.customer,
      items: o.items.map((i) => ({
        name: i.name,
        sku: i.sku ?? '',
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        color: i.color ?? '',
        size: i.size ?? '',
      })),
      paymentMethod: o.paymentMethod,
      paymentTrxId: o.paymentTrxId ?? '',
      paymentStatus: o.paymentStatus,
      couponCode: o.couponCode ?? '',
      subtotal: o.subtotal,
      vat: o.vat,
      shipping: o.shipping,
      discount: o.discount,
      total: o.total,
      status: o.status,
      createdAt: (o as unknown as { createdAt?: Date }).createdAt ?? null,
    }));

    return NextResponse.json({ success: true, orders, total });
  } catch (error) {
    console.error('[admin orders GET]', error);
    return NextResponse.json({ success: false, error: 'অর্ডার লোড করা যায়নি' }, { status: 500 });
  }
}
