// app/api/e-commerce/route.ts
// পাবলিক স্টোর API:
//   GET  /api/e-commerce                         → সক্রিয় প্রোডাক্ট + কনফিগ (ডেলিভারি, পেমেন্ট অপশন)
//   GET  /api/e-commerce?order=SF...&phone=01... → অর্ডার ট্র্যাকিং
//   POST /api/e-commerce?action=quote            → সার্ভারের হিসাবে মোট দাম (কার্ট দেখানোর জন্য)
//   POST /api/e-commerce                         → অর্ডার দেওয়া
// দাম, ভ্যাট, শিপিং, কুপন সবকিছু সার্ভার নিজে ডাটাবেস থেকে হিসাব করে, ক্লায়েন্টের পাঠানো কোনো অঙ্ক বিশ্বাস করা হয় না।

import { randomBytes } from 'crypto';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectMongo } from '@/lib/mongo';
import Product from '@/models/Product';
import Order from '@/models/Order';
import { checkCoupon, computeQuote, type Quote } from '@/lib/pricing';
import {
  MAX_LINES_PER_ORDER,
  MAX_QTY_PER_LINE,
  getCoupons,
  getPaymentOptions,
  getShippingOptions,
  getVatRate,
} from '@/lib/store-config';
import { clientIp, rateLimit } from '@/lib/rate-limit';
import { toProduct, type ProductLike } from '@/lib/serialize';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const OBJECT_ID = /^[a-f0-9]{24}$/i;
const BD_PHONE = /^(?:\+?88)?(01[3-9]\d{8})$/;
const TRX_ID = /^[A-Za-z0-9]{6,20}$/;

function fail(error: string, status = 400, extra?: Record<string, unknown>) {
  return NextResponse.json({ success: false, error, ...extra }, { status });
}

function tooMany(retryAfterSec: number) {
  const res = fail('অনেক বেশি অনুরোধ হয়েছে, কিছুক্ষণ পরে আবার চেষ্টা করুন', 429);
  res.headers.set('Retry-After', String(retryAfterSec));
  return res;
}

function str(v: unknown, max: number): string {
  return typeof v === 'string' ? v.trim().slice(0, max) : '';
}

// ---------------------------------------------------------------- GET

export async function GET(req: Request) {
  const url = new URL(req.url);
  const ip = clientIp(req);

  try {
    // অর্ডার ট্র্যাকিং
    const orderNo = url.searchParams.get('order');
    if (orderNo !== null) {
      const rl = rateLimit(`track:${ip}`, 15, 60_000);
      if (!rl.ok) return tooMany(rl.retryAfterSec);

      const phoneMatch = BD_PHONE.exec((url.searchParams.get('phone') ?? '').replace(/[\s-]/g, ''));
      if (!phoneMatch) return fail('সঠিক মোবাইল নম্বর দিন');

      await connectMongo();
      const order = await Order.findOne({ orderNumber: orderNo.trim().toUpperCase().slice(0, 40) }).lean();
      if (!order || order.customer.phone !== phoneMatch[1]) {
        return fail('এই তথ্যে কোনো অর্ডার পাওয়া যায়নি', 404);
      }
      return NextResponse.json({
        success: true,
        order: {
          orderNumber: order.orderNumber,
          status: order.status,
          paymentStatus: order.paymentStatus,
          paymentMethod: order.paymentMethod,
          total: order.total,
          items: order.items.map((i) => ({ name: i.name, quantity: i.quantity, unitPrice: i.unitPrice })),
          history: (order.statusHistory ?? []).map((h) => ({ status: h.status, at: h.at })),
        },
      });
    }

    // প্রোডাক্ট তালিকা
    await connectMongo();
    const docs = await Product.find({ active: true }).sort({ featured: -1, createdAt: -1 }).limit(500).lean();
    const products = (docs as unknown as ProductLike[]).map(toProduct);

    return NextResponse.json(
      {
        success: true,
        products,
        config: {
          shipping: getShippingOptions(),
          payments: getPaymentOptions(),
          vatPercent: Math.round(getVatRate() * 10000) / 100,
          maxQtyPerLine: MAX_QTY_PER_LINE,
          couponsEnabled: getCoupons().length > 0,
        },
      },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (error) {
    console.error('[e-commerce GET]', error);
    return fail('সার্ভারে সমস্যা হয়েছে, কিছুক্ষণ পরে আবার চেষ্টা করুন', 500);
  }
}

// ---------------------------------------------------------------- POST helpers

type Line = {
  productId: string;
  quantity: number;
  color: string;
  size: string;
};

type Built =
  | { ok: false; error: string; status?: number }
  | {
      ok: true;
      quote: Quote;
      lines: Line[];
      productMap: Map<string, ProductLike & { stock: number }>;
      totals: Map<string, number>;
      shippingKey: string;
    };

// কার্টের লাইন যাচাই করে সার্ভারের দামে হিসাব বানায়
async function buildQuote(body: Record<string, unknown>): Promise<Built> {
  const rawItems = body.items;
  if (!Array.isArray(rawItems) || rawItems.length === 0) return { ok: false, error: 'কার্ট খালি' };
  if (rawItems.length > MAX_LINES_PER_ORDER) return { ok: false, error: 'একসাথে অনেক বেশি আইটেম' };

  const lines: Line[] = [];
  for (const raw of rawItems) {
    if (!raw || typeof raw !== 'object') return { ok: false, error: 'অবৈধ আইটেম' };
    const r = raw as Record<string, unknown>;
    const productId = str(r.productId, 24);
    const quantity = Number(r.quantity);
    if (!OBJECT_ID.test(productId)) return { ok: false, error: 'অবৈধ প্রোডাক্ট' };
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QTY_PER_LINE) {
      return { ok: false, error: `প্রতি আইটেমে ১–${MAX_QTY_PER_LINE} টি নেওয়া যাবে` };
    }
    lines.push({ productId, quantity, color: str(r.color, 40), size: str(r.size, 40) });
  }

  const ids = Array.from(new Set(lines.map((l) => l.productId)));
  const docs = (await Product.find({
    _id: { $in: ids.map((id) => new mongoose.Types.ObjectId(id)) },
    active: true,
  }).lean()) as unknown as (ProductLike & { stock: number })[];

  const productMap = new Map<string, ProductLike & { stock: number }>();
  for (const d of docs) productMap.set(d._id.toString(), d);

  const totals = new Map<string, number>();
  for (const l of lines) {
    const p = productMap.get(l.productId);
    if (!p) return { ok: false, error: 'একটি প্রোডাক্ট আর পাওয়া যাচ্ছে না, কার্ট আপডেট করুন', status: 409 };

    if (p.colors && p.colors.length > 0 && !p.colors.includes(l.color)) {
      return { ok: false, error: `${p.name}: রং বেছে নিন` };
    }
    if (p.sizes && p.sizes.length > 0 && !p.sizes.includes(l.size)) {
      return { ok: false, error: `${p.name}: সাইজ বেছে নিন` };
    }
    if ((!p.colors || p.colors.length === 0) && l.color) l.color = '';
    if ((!p.sizes || p.sizes.length === 0) && l.size) l.size = '';

    totals.set(l.productId, (totals.get(l.productId) ?? 0) + l.quantity);
  }

  for (const [id, qty] of Array.from(totals.entries())) {
    const p = productMap.get(id)!;
    if (p.stock < qty) {
      return {
        ok: false,
        error: p.stock <= 0 ? `${p.name}: স্টক শেষ` : `${p.name}: মাত্র ${p.stock} টি আছে`,
        status: 409,
      };
    }
  }

  const shippingKey = str(body.shippingKey, 40);
  const shipping = getShippingOptions().find((s) => s.key === shippingKey);
  if (!shipping) return { ok: false, error: 'ডেলিভারি এলাকা বেছে নিন' };

  // কুপন আগে প্রোডাক্ট-ডিসকাউন্ট সহ subtotal দিয়ে যাচাই
  const preQuote = computeQuote({
    lines: lines.map((l) => {
      const p = productMap.get(l.productId)!;
      return { price: p.price, discount: p.discount ?? 0, quantity: l.quantity };
    }),
    shippingCharge: shipping.charge,
    vatRate: getVatRate(),
  });

  const couponCode = str(body.couponCode, 40);
  if (!couponCode) return { ok: true, quote: preQuote, lines, productMap, totals, shippingKey };

  const check = checkCoupon(getCoupons(), couponCode, preQuote.subtotal);
  if (!check.ok) return { ok: false, error: check.error };

  const quote = computeQuote({
    lines: lines.map((l) => {
      const p = productMap.get(l.productId)!;
      return { price: p.price, discount: p.discount ?? 0, quantity: l.quantity };
    }),
    shippingCharge: shipping.charge,
    vatRate: getVatRate(),
    coupon: check.coupon,
  });
  return { ok: true, quote, lines, productMap, totals, shippingKey };
}

async function releaseStock(done: { id: string; qty: number }[]) {
  for (const d of done) {
    try {
      await Product.updateOne(
        { _id: new mongoose.Types.ObjectId(d.id) },
        { $inc: { stock: d.qty, sold: -d.qty } }
      );
    } catch (e) {
      console.error('[e-commerce] stock rollback failed', d, e);
    }
  }
}

function newOrderNumber(): string {
  const d = new Date(Date.now() + 6 * 3600 * 1000); // বাংলাদেশ সময়ের তারিখ
  const yymmdd =
    String(d.getUTCFullYear()).slice(2) +
    String(d.getUTCMonth() + 1).padStart(2, '0') +
    String(d.getUTCDate()).padStart(2, '0');
  return `SF${yymmdd}-${randomBytes(3).toString('hex').toUpperCase()}`;
}

// ---------------------------------------------------------------- POST

export async function POST(req: Request) {
  const url = new URL(req.url);
  const isQuote = url.searchParams.get('action') === 'quote';
  const ip = clientIp(req);

  const rl = isQuote ? rateLimit(`quote:${ip}`, 60, 60_000) : rateLimit(`order:${ip}`, 6, 10 * 60_000);
  if (!rl.ok) return tooMany(rl.retryAfterSec);

  const declared = Number(req.headers.get('content-length') ?? 0);
  if (declared > 50_000) return fail('অনুরোধ অনেক বড়', 413);

  let body: Record<string, unknown>;
  try {
    const parsed: unknown = await req.json();
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return fail('অবৈধ ডেটা');
    body = parsed as Record<string, unknown>;
  } catch {
    return fail('অবৈধ ডেটা');
  }

  try {
    await connectMongo();

    const built = await buildQuote(body);
    if (!built.ok) return fail(built.error, built.status ?? 400);

    if (isQuote) {
      return NextResponse.json({
        success: true,
        quote: built.quote,
        lines: built.lines.map((l, i) => ({
          productId: l.productId,
          unitPrice: built.quote.lines[i].unitPrice,
          lineTotal: built.quote.lines[i].lineTotal,
        })),
      });
    }

    // ---- গ্রাহকের তথ্য ও পেমেন্ট যাচাই
    const customer = (body.customer && typeof body.customer === 'object' ? body.customer : {}) as Record<string, unknown>;
    const name = str(customer.name, 120);
    const address = str(customer.address, 500);
    const phoneMatch = BD_PHONE.exec(str(customer.phone, 20).replace(/[\s-]/g, ''));

    if (name.length < 2) return fail('নাম লিখুন');
    if (!phoneMatch) return fail('সঠিক বাংলাদেশি মোবাইল নম্বর দিন (যেমন 017XXXXXXXX)');
    if (address.length < 10) return fail('সম্পূর্ণ ঠিকানা লিখুন (এলাকা, থানা, জেলা সহ)');

    const method = str(body.paymentMethod, 20);
    const option = getPaymentOptions().find((p) => p.method === method);
    if (!option) return fail('এই পেমেন্ট পদ্ধতি এখন চালু নেই');

    let paymentTrxId: string | undefined;
    if (option.needsTrxId) {
      const trx = str(body.paymentTrxId, 20);
      if (!TRX_ID.test(trx)) return fail(`${method} ট্রানজেকশন আইডি দিন (৬–২০ অক্ষর/সংখ্যা)`);
      paymentTrxId = trx.toUpperCase();
    }

    // ---- স্টক কমানো (প্রতি প্রোডাক্টে অ্যাটমিক, শর্ত: stock >= qty)
    const done: { id: string; qty: number }[] = [];
    for (const [id, qty] of Array.from(built.totals.entries())) {
      const r = await Product.updateOne(
        { _id: new mongoose.Types.ObjectId(id), active: true, stock: { $gte: qty } },
        { $inc: { stock: -qty, sold: qty } }
      );
      if (r.modifiedCount !== 1) {
        await releaseStock(done);
        const p = built.productMap.get(id);
        return fail(`${p ? p.name : 'একটি প্রোডাক্ট'}: স্টক শেষ হয়ে গেছে, কার্ট আপডেট করুন`, 409);
      }
      done.push({ id, qty });
    }

    // ---- অর্ডার সেভ (দাম অর্ডারের সময়ের স্ন্যাপশট হিসেবে)
    const items = built.lines.map((l, i) => {
      const p = built.productMap.get(l.productId)!;
      return {
        product: new mongoose.Types.ObjectId(l.productId),
        name: p.name,
        sku: p.sku ?? undefined,
        unitPrice: built.quote.lines[i].unitPrice,
        quantity: l.quantity,
        color: l.color || undefined,
        size: l.size || undefined,
      };
    });

    let saved: { orderNumber: string } | null = null;
    for (let attempt = 0; attempt < 3 && !saved; attempt++) {
      try {
        const created = await Order.create({
          orderNumber: newOrderNumber(),
          customer: { name, phone: phoneMatch[1], address },
          items,
          paymentMethod: method,
          paymentTrxId,
          paymentStatus: 'Unpaid',
          couponCode: built.quote.couponCode ?? undefined,
          subtotal: built.quote.subtotal,
          vat: built.quote.vat,
          shipping: built.quote.shipping,
          discount: built.quote.couponDiscount,
          total: built.quote.total,
          status: 'Pending',
          statusHistory: [{ status: 'Pending', at: new Date() }],
        });
        saved = { orderNumber: created.orderNumber };
      } catch (e) {
        const dup = (e as { code?: number }).code === 11000;
        if (!dup || attempt === 2) {
          await releaseStock(done);
          throw e;
        }
      }
    }

    return NextResponse.json({
      success: true,
      order: {
        orderNumber: saved!.orderNumber,
        total: built.quote.total,
        paymentMethod: method,
        payTo: option.number ?? null,
      },
    });
  } catch (error) {
    console.error('[e-commerce POST]', error);
    return fail('অর্ডার সম্পন্ন করা যায়নি, কিছুক্ষণ পরে আবার চেষ্টা করুন', 500);
  }
}
