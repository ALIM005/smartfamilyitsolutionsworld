// lib/pricing.ts
// দামের হিসাবের একমাত্র জায়গা (সার্ভারে ব্যবহার হয়)। কোনো env বা ডাটাবেস নির্ভরতা নেই, তাই আলাদাভাবে টেস্ট করা যায়।

export type CouponRule = {
  code: string;
  percent: number;
  maxDiscount?: number;
  minSubtotal?: number;
  expiresAt?: string;
};

export type QuoteLineInput = {
  price: number; // মূল দাম
  discount: number; // প্রোডাক্টের শতকরা ছাড় (০-৯০)
  quantity: number;
};

export type Quote = {
  lines: { unitPrice: number; lineTotal: number }[];
  subtotal: number; // প্রোডাক্ট ডিসকাউন্টের পরের যোগফল
  productSavings: number; // প্রোডাক্ট ডিসকাউন্টে মোট বাঁচল
  couponCode: string | null;
  couponDiscount: number;
  vat: number;
  shipping: number;
  total: number;
};

export const round2 = (n: number): number => Math.round((n + Number.EPSILON) * 100) / 100;

export function unitPriceAfterDiscount(price: number, discount: number): number {
  const d = Math.min(90, Math.max(0, discount || 0));
  return round2(price * (1 - d / 100));
}

export type CouponCheck =
  | { ok: true; coupon: CouponRule }
  | { ok: false; error: string };

export function checkCoupon(
  coupons: CouponRule[],
  code: string | undefined | null,
  subtotal: number,
  now: Date = new Date()
): CouponCheck {
  const wanted = (code ?? '').trim().toUpperCase();
  const coupon = coupons.find((c) => c.code === wanted);
  if (!wanted || !coupon) return { ok: false, error: 'কুপন কোডটি সঠিক নয়' };

  if (coupon.expiresAt) {
    // মেয়াদ ওই তারিখের শেষ পর্যন্ত (বাংলাদেশ সময় ধরে, UTC+6)
    const end = new Date(`${coupon.expiresAt.slice(0, 10)}T23:59:59+06:00`);
    if (Number.isNaN(end.getTime()) || now.getTime() > end.getTime()) {
      return { ok: false, error: 'কুপনের মেয়াদ শেষ' };
    }
  }
  if (coupon.minSubtotal && subtotal < coupon.minSubtotal) {
    return { ok: false, error: `এই কুপনের জন্য কমপক্ষে ৳${coupon.minSubtotal} কেনাকাটা করতে হবে` };
  }
  return { ok: true, coupon };
}

export function computeQuote(args: {
  lines: QuoteLineInput[];
  shippingCharge: number;
  vatRate: number;
  coupon?: CouponRule | null;
}): Quote {
  const { lines, shippingCharge, vatRate, coupon } = args;

  const priced = lines.map((l) => {
    const unitPrice = unitPriceAfterDiscount(l.price, l.discount);
    return { unitPrice, lineTotal: round2(unitPrice * l.quantity) };
  });

  const subtotal = round2(priced.reduce((s, l) => s + l.lineTotal, 0));
  const undiscounted = round2(lines.reduce((s, l) => s + l.price * l.quantity, 0));
  const productSavings = round2(Math.max(0, undiscounted - subtotal));

  let couponDiscount = 0;
  if (coupon) {
    couponDiscount = round2((subtotal * coupon.percent) / 100);
    if (coupon.maxDiscount !== undefined) couponDiscount = Math.min(couponDiscount, coupon.maxDiscount);
    couponDiscount = Math.min(couponDiscount, subtotal);
  }

  // ভ্যাট ছাড়ের পরের অঙ্কের ওপর
  const taxable = round2(subtotal - couponDiscount);
  const vat = round2(taxable * vatRate);
  const shipping = round2(shippingCharge);
  const total = round2(taxable + vat + shipping);

  return {
    lines: priced,
    subtotal,
    productSavings,
    couponCode: coupon ? coupon.code : null,
    couponDiscount,
    vat,
    shipping,
    total,
  };
}
