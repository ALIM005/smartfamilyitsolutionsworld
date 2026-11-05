// lib/store-config.ts
// Store settings. Change price/stock/discount from the admin panel according to the product.
// VAT, delivery charge, coupons, and payment numbers can be changed using Vercel Environment Variables;
// without editing code or redeploying, just change the variables and Redeploy.


export type ShippingOption = { key: string; label: string; charge: number };


export type Coupon = {
  code: string;
  percent: number; // 1-90
  maxDiscount?: number; // maximum discount in currency
  minSubtotal?: number; // minimum purchase amount
  expiresAt?: string; // ISO date, e.g. 2026-12-31
};


export const MAX_QTY_PER_LINE = 10;
export const MAX_LINES_PER_ORDER = 30;


function num(value: string | undefined, fallback: number, min = 0, max = 1_000_000): number {
  if (value === undefined || value.trim() === '') return fallback;
  const n = Number(value);
  return Number.isFinite(n) && n >= min && n <= max ? n : fallback;
}


export function getVatRate(): number {
  return num(process.env.STORE_VAT_PERCENT, 5, 0, 50) / 100;
}


export function getShippingOptions(): ShippingOption[] {
  return [
    { key: 'inside-dhaka', label: 'Inside Dhaka', charge: num(process.env.SHIPPING_INSIDE_DHAKA, 120) },
    { key: 'outside-dhaka', label: 'Outside Dhaka', charge: num(process.env.SHIPPING_OUTSIDE_DHAKA, 180) },
    { key: 'express', label: 'Express Delivery', charge: num(process.env.SHIPPING_EXPRESS, 250) },
  ];
}


export type PaymentMethod = 'COD' | 'bKash' | 'Nagad' | 'Rocket';


// Online card payment excluded: without a payment gateway, money cannot be collected by card.
// bKash/Nagad/Rocket: the customer will Send Money to your number and provide the transaction ID; you will mark it Paid from the admin panel.
export function getPaymentOptions(): { method: PaymentMethod; number?: string; needsTrxId: boolean }[] {
  const options: { method: PaymentMethod; number?: string; needsTrxId: boolean }[] = [
    { method: 'COD', needsTrxId: false },
  ];
  const wallets: [PaymentMethod, string | undefined][] = [
    ['bKash', process.env.BKASH_NUMBER],
    ['Nagad', process.env.NAGAD_NUMBER],
    ['Rocket', process.env.ROCKET_NUMBER],
  ];
  // If a number is not set, the wallet option is not shown
  for (const [method, number] of wallets) {
    if (number && number.trim()) options.push({ method, number: number.trim(), needsTrxId: true });
  }
  return options;
}


// STORE_COUPONS='[{"code":"EID10","percent":10,"maxDiscount":500,"minSubtotal":2000,"expiresAt":"2026-12-31"}]'
export function getCoupons(): Coupon[] {
  const raw = process.env.STORE_COUPONS;
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const out: Coupon[] = [];
    for (const c of parsed) {
      if (!c || typeof c !== 'object') continue;
      const r = c as Record<string, unknown>;
      const code = typeof r.code === 'string' ? r.code.trim().toUpperCase() : '';
      const percent = Number(r.percent);
      if (!code || !Number.isFinite(percent) || percent < 1 || percent > 90) continue;
      const coupon: Coupon = { code, percent };
      if (r.maxDiscount !== undefined && Number.isFinite(Number(r.maxDiscount))) coupon.maxDiscount = Number(r.maxDiscount);
      if (r.minSubtotal !== undefined && Number.isFinite(Number(r.minSubtotal))) coupon.minSubtotal = Number(r.minSubtotal);
      if (typeof r.expiresAt === 'string') coupon.expiresAt = r.expiresAt;
      out.push(coupon);
    }
    return out;
  } catch {
    return [];
  }
}