// lib/pricing.ts
// The single place for price calculation (used on the server). It has no env or database dependency, so it can be tested separately.


export type CouponRule = {
  code: string;
  percent: number;
  maxDiscount?: number;
  minSubtotal?: number;
  expiresAt?: string;
};


export type QuoteLineInput = {
  price: number; // original price
  discount: number; // product percentage discount (0-90)
  quantity: number;
};


export type Quote = {
  lines: { unitPrice: number; lineTotal: number }[];
  subtotal: number; // total after product discounts
  productSavings: number; // total saved through product discounts
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
  if (!wanted || !coupon) return { ok: false, error: 'The coupon code is not valid' };


  if (coupon.expiresAt) {
    // The validity lasts until the end of that date (considering Bangladesh time, UTC+6)
    const end = new Date(`${coupon.expiresAt.slice(0, 10)}T23:59:59+06:00`);
    if (Number.isNaN(end.getTime()) || now.getTime() > end.getTime()) {
      return { ok: false, error: 'The coupon has expired' };
    }
  }
  if (coupon.minSubtotal && subtotal < coupon.minSubtotal) {
    return { ok: false, error: `A minimum purchase of ৳${coupon.minSubtotal} is required for this coupon` };
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


  // VAT is applied on the amount after discount
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