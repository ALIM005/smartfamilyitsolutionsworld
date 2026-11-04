'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { loadPostalIndex, officeKey, type PostalIndex, type PostOffice } from '@/lib/postcodes'; // alias না থাকলে '../../lib/postcodes'

/* ====================== Config & Constants ====================== */
type Currency = 'BDT' | 'USD';

const BDT_PER_USD: number = Number(process.env.NEXT_PUBLIC_BDT_PER_USD) > 0
  ? Number(process.env.NEXT_PUBLIC_BDT_PER_USD)
  : 120;

// true হলে API ফেইল করলেও (SSLCommerz ছাড়া) অর্ডার localStorage-এ সেভ করে সাকসেস দেখাবে। Production-এ false রাখুন।
const ORDER_FALLBACK_ENABLED = process.env.NEXT_PUBLIC_ORDER_OFFLINE_FALLBACK === 'true';

const DELIVERY_CHARGE_BDT = 100;
const REQUEST_TIMEOUT_MS = 20000;
const OTHER_POSTAL = '__other__';

const BD_PHONE_RE = /^01[3-9]\d{8}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const TRX_RE = /^[A-Za-z0-9]{6,20}$/;
const POSTAL_RE = /^\d{4}$/;

const usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const bdtNumberFormatter = new Intl.NumberFormat('en-BD');

interface CartItem {
  id: string;
  title: string;
  priceBDT: number; // Base price in BDT
  quantity: number;
  image?: string;
}

interface OrderApiResponse {
  gatewayUrl?: string;
  orderId?: string;
  id?: string;
  message?: string;
}

const PAYMENT_METHODS: { value: string; label: string }[] = [
  { value: 'SSLCommerz', label: 'SSLCommerz (Online Payment / Cards / Mobile Banking)' },
  { value: 'Cash on Delivery', label: 'Cash on Delivery' },
  { value: 'bKash', label: 'bKash (Manual)' },
  { value: 'Nagad', label: 'Nagad (Manual)' },
  { value: 'Cellfin (IBBL)', label: 'Cellfin (IBBL)' },
];

const FIELD_ORDER = [
  'fullName', 'phone', 'email', 'village', 'address', 'division', 'district', 'upazila',
  'postal', 'postalManual', 'bkashNumber', 'bkashTrx', 'nagadNumber', 'nagadTrx', 'cellfin',
];

const DEV_DEMO_CART: CartItem[] = [
  { id: 'PROD-101', title: 'Smart Wireless Headset', priceBDT: 60, quantity: 1 },
];

const inputCls =
  'w-full rounded-xl border border-[#F3C6D3] bg-[#FFFAFB] px-4 py-2.5 text-sm text-[#2E0A1C] placeholder:text-[#B590A0] transition focus:border-[#B0124F] focus:outline-none focus:ring-2 focus:ring-[#B0124F]/25 disabled:cursor-not-allowed disabled:bg-[#FBEAEE] disabled:text-[#B590A0]';
const inputErrCls = inputCls.replace('border-[#F3C6D3]', 'border-[#D6264F]');
const labelCls = 'mb-1.5 block text-sm font-medium text-[#4A0F2E]';
const gradientBtn =
  'bg-gradient-to-r from-[#B0124F] to-[#D81B7A] text-white shadow-lg shadow-[#B0124F]/30 transition hover:from-[#990F44] hover:to-[#C21769]';

/* ====================== Helpers ====================== */
const storage = {
  get(key: string): string | null {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key: string, value: string): boolean {
    try {
      window.localStorage.setItem(key, value);
      return true;
    } catch {
      return false;
    }
  },
  remove(key: string): void {
    try {
      window.localStorage.removeItem(key);
    } catch {
      /* ignore */
    }
  },
};

function parseCart(raw: string | null): CartItem[] {
  if (!raw) return [];
  try {
    const data: unknown = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    const items: CartItem[] = [];
    for (const it of data) {
      if (!it || typeof it !== 'object') continue;
      const rec = it as Record<string, unknown>;
      const price = Number(rec.priceBDT);
      const qty = Math.floor(Number(rec.quantity));
      if (!Number.isFinite(price) || price < 0 || !Number.isFinite(qty) || qty < 1) continue;
      items.push({
        id: String(rec.id ?? `item-${items.length}`),
        title: String(rec.title ?? 'Item'),
        priceBDT: price,
        quantity: qty,
        image: typeof rec.image === 'string' ? rec.image : undefined,
      });
    }
    return items;
  } catch {
    return [];
  }
}

function parseOrders(raw: string | null): unknown[] {
  if (!raw) return [];
  try {
    const data: unknown = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function normalizePhone(value: string): string {
  let d = value.replace(/[\s-]/g, '');
  if (d.startsWith('+88')) d = d.slice(3);
  else if (d.startsWith('88') && d.length === 13) d = d.slice(2);
  return d;
}

function generateOrderId(): string {
  let n: number;
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    n = 100000 + (buf[0] % 900000);
  } else {
    n = Math.floor(100000 + Math.random() * 900000);
  }
  return `ORD-${n}`;
}

function isSafeGatewayUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === 'https:' || (process.env.NODE_ENV !== 'production' && u.protocol === 'http:');
  } catch {
    return false;
  }
}

const encodeOffice = (o: PostOffice) => `${o.code}|${o.name}`;

function FieldError({ id, msg }: { id: string; msg?: string }) {
  if (!msg) return null;
  return (
    <p id={`${id}-error`} className="mt-1 text-xs font-medium text-[#C0143C]">
      {msg}
    </p>
  );
}

/* ====================== Page ====================== */
export default function CheckoutPage() {
  const router = useRouter();

  // Refs
  const mountedRef = useRef(true);
  const abortRef = useRef<AbortController | null>(null);
  const submittingRef = useRef(false);
  const attemptIdRef = useRef('');

  // Currency
  const [currency, setCurrency] = useState<Currency>('BDT');

  // Form states
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [village, setVillage] = useState('');
  const [detailedAddress, setDetailedAddress] = useState('');
  const [division, setDivision] = useState('');
  const [district, setDistrict] = useState('');
  const [upazila, setUpazila] = useState('');
  const [postalValue, setPostalValue] = useState(''); // "code|name" বা OTHER_POSTAL
  const [manualPostal, setManualPostal] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('SSLCommerz');

  // Payment gateway inputs
  const [bkashNumber, setBkashNumber] = useState('');
  const [bkashTrxId, setBkashTrxId] = useState('');
  const [nagadNumber, setNagadNumber] = useState('');
  const [nagadTrxId, setNagadTrxId] = useState('');
  const [cellfinAccount, setCellfinAccount] = useState('');

  // Cart & submission
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartReady, setCartReady] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [completedOrderId, setCompletedOrderId] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState('');

  // Postal data
  const [postalIndex, setPostalIndex] = useState<PostalIndex | null>(null);
  const [postalStatus, setPostalStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  /* ---------- Effects ---------- */
  const fetchPostalData = useCallback(() => {
    setPostalStatus('loading');
    loadPostalIndex()
      .then((idx) => {
        if (!mountedRef.current) return;
        setPostalIndex(idx);
        setPostalStatus('ready');
      })
      .catch(() => {
        if (!mountedRef.current) return;
        setPostalStatus('error');
      });
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    fetchPostalData();
    return () => {
      mountedRef.current = false;
      abortRef.current?.abort();
    };
  }, [fetchPostalData]);

  useEffect(() => {
    const savedCurrency = storage.get('preferred_currency');
    if (savedCurrency === 'BDT' || savedCurrency === 'USD') setCurrency(savedCurrency);

    let items = parseCart(storage.get('cart_items'));
    if (items.length === 0) items = parseCart(storage.get('cartItems'));
    if (items.length === 0 && process.env.NODE_ENV !== 'production') items = DEV_DEMO_CART;
    setCartItems(items);
    setCartReady(true);
  }, []);

  // ব্যাক বাটনে (bfcache) ফিরলে বাটন যেন আটকে না থাকে
  useEffect(() => {
    const onShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        submittingRef.current = false;
        setIsSubmitting(false);
      }
    };
    window.addEventListener('pageshow', onShow);
    return () => window.removeEventListener('pageshow', onShow);
  }, []);

  /* ---------- Derived values ---------- */
  const subtotalBDT = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.priceBDT * item.quantity, 0),
    [cartItems]
  );
  const grandTotalBDT = subtotalBDT + DELIVERY_CHARGE_BDT;

  const districtList = useMemo(
    () => (postalIndex && division ? postalIndex.districts[division] ?? [] : []),
    [postalIndex, division]
  );
  const thanaList = useMemo(
    () => (postalIndex && district ? postalIndex.thanas[district] ?? [] : []),
    [postalIndex, district]
  );
  const offices: PostOffice[] = useMemo(
    () => (postalIndex && district && upazila ? postalIndex.offices[officeKey(district, upazila)] ?? [] : []),
    [postalIndex, district, upazila]
  );

  const manualPostalMode = Boolean(upazila) && (offices.length === 0 || postalValue === OTHER_POSTAL);

  const { finalPostalCode, postOfficeName } = useMemo(() => {
    if (manualPostalMode) return { finalPostalCode: manualPostal.trim(), postOfficeName: '' };
    const [code = '', ...rest] = postalValue.split('|');
    return { finalPostalCode: code, postOfficeName: rest.join('|') };
  }, [manualPostalMode, manualPostal, postalValue]);

  /* ---------- UI helpers ---------- */
  const clearError = (key: string) =>
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });

  const bind =
    (key: string, setter: (v: string) => void) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setter(e.target.value);
      clearError(key);
    };

  const cls = (id: string) => (errors[id] ? inputErrCls : inputCls);
  const aria = (id: string) => ({
    'aria-invalid': errors[id] ? (true as const) : undefined,
    'aria-describedby': errors[id] ? `${id}-error` : undefined,
  });

  const handleCurrencyChange = (value: Currency) => {
    setCurrency(value);
    storage.set('preferred_currency', value);
  };

  const formatPrice = (amountBDT: number) => {
    const bdtFormatted = `৳${bdtNumberFormatter.format(Math.round(amountBDT))}`;
    const usdFormatted = usdFormatter.format(amountBDT / BDT_PER_USD);
    const primary = currency === 'USD' ? usdFormatted : bdtFormatted;
    const secondary = currency === 'USD' ? bdtFormatted : usdFormatted;
    return (
      <span className="flex items-center gap-1.5 font-bold">
        <span className="text-[#B0124F]">{primary}</span>
        <span className="text-xs text-[#7A5566] font-normal">({secondary})</span>
      </span>
    );
  };

  /* ---------- Validation ---------- */
  const validate = (): Record<string, string> => {
    const e: Record<string, string> = {};
    if (fullName.trim().length < 2) e.fullName = 'Please enter your full name.';
    if (!BD_PHONE_RE.test(normalizePhone(phoneNumber))) e.phone = 'Enter a valid mobile number (01XXXXXXXXX).';
    if (emailAddress.trim() && !EMAIL_RE.test(emailAddress.trim())) e.email = 'Enter a valid email address.';
    if (village.trim().length < 2) e.village = 'Please enter your village / area / house.';
    if (detailedAddress.trim().length < 5) e.address = 'Please enter a more detailed address.';
    if (!division) e.division = 'Please select a division.';
    if (!district) e.district = 'Please select a district.';
    if (!upazila) e.upazila = 'Please select a thana / upazila.';

    if (manualPostalMode) {
      const key = offices.length > 0 ? 'postalManual' : 'postal';
      const v = manualPostal.trim();
      if (postalValue === OTHER_POSTAL && !v) e[key] = 'Enter your 4-digit postal code.';
      else if (v && !POSTAL_RE.test(v)) e[key] = 'Postal code must be exactly 4 digits.';
    }

    if (paymentMethod === 'bKash') {
      if (!BD_PHONE_RE.test(normalizePhone(bkashNumber))) e.bkashNumber = 'Enter a valid bKash number.';
      if (!TRX_RE.test(bkashTrxId.trim())) e.bkashTrx = 'Enter a valid Transaction ID.';
    }
    if (paymentMethod === 'Nagad') {
      if (!BD_PHONE_RE.test(normalizePhone(nagadNumber))) e.nagadNumber = 'Enter a valid Nagad number.';
      if (!TRX_RE.test(nagadTrxId.trim())) e.nagadTrx = 'Enter a valid Transaction ID.';
    }
    if (paymentMethod === 'Cellfin (IBBL)' && cellfinAccount.trim().length < 4) {
      e.cellfin = 'Enter your Cellfin account number or TrxID.';
    }
    return e;
  };

  /* ---------- Submit ---------- */
  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submittingRef.current) return;
    setSubmitError('');

    if (cartItems.length === 0) {
      setSubmitError('Your cart is empty.');
      return;
    }

    const found = validate();
    if (Object.keys(found).length > 0) {
      setErrors(found);
      const first = FIELD_ORDER.find((k) => found[k]);
      if (first) requestAnimationFrame(() => document.getElementById(first)?.focus());
      return;
    }
    setErrors({});

    submittingRef.current = true;
    setIsSubmitting(true);

    // একই চেষ্টার retry-তে একই ID, তাই সার্ভারে ডুপ্লিকেট অর্ডার ঠেকানো যায়
    if (!attemptIdRef.current) attemptIdRef.current = generateOrderId();
    const orderId = attemptIdRef.current;

    const phone = normalizePhone(phoneNumber);
    const paymentDetails =
      paymentMethod === 'bKash'
        ? `bKash No: ${normalizePhone(bkashNumber)}, TrxID: ${bkashTrxId.trim()}`
        : paymentMethod === 'Nagad'
        ? `Nagad No: ${normalizePhone(nagadNumber)}, TrxID: ${nagadTrxId.trim()}`
        : paymentMethod === 'Cellfin (IBBL)'
        ? `Cellfin: ${cellfinAccount.trim()}`
        : paymentMethod === 'SSLCommerz'
        ? 'Online Payment via SSLCommerz Gateway'
        : 'Cash on Delivery';

    const orderData = {
      id: orderId,
      customerName: fullName.trim(),
      phone,
      email: emailAddress.trim(),
      village: village.trim(),
      division,
      district,
      upazila,
      postalCode: finalPostalCode,
      postOffice: postOfficeName,
      address: `${detailedAddress.trim()}, ${upazila}, ${district}, ${division}`,
      items: cartItems.map((item) => `${item.title} (x${item.quantity})`).join(', '),
      itemsDetail: cartItems.map((i) => ({
        id: i.id,
        title: i.title,
        quantity: i.quantity,
        priceBDT: i.priceBDT,
      })),
      subtotalBDT,
      deliveryChargeBDT: DELIVERY_CHARGE_BDT,
      totalAmountBDT: grandTotalBDT,
      currency,
      paymentMethod,
      paymentDetails,
      status: paymentMethod === 'SSLCommerz' ? 'Pending Payment' : 'Pending',
      date: new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Dhaka' }),
    };

    const persistLocally = (id: string) => {
      const existing = parseOrders(storage.get('marketplace_orders'));
      storage.set('marketplace_orders', JSON.stringify([{ ...orderData, id }, ...existing].slice(0, 50)));
      storage.remove('cart_items');
      storage.remove('cartItems');
      attemptIdRef.current = '';
      setCompletedOrderId(id);
      setOrderSuccess(true);
    };

    const controller = new AbortController();
    abortRef.current = controller;
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    let redirecting = false;

    try {
      const response = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Idempotency-Key': orderId },
        body: JSON.stringify(orderData),
        signal: controller.signal,
      });

      let resData: OrderApiResponse = {};
      try {
        resData = (await response.json()) as OrderApiResponse;
      } catch {
        /* non-JSON response */
      }

      if (!response.ok) {
        throw new Error(resData.message || `Order request failed (${response.status})`);
      }

      if (paymentMethod === 'SSLCommerz') {
        if (!resData.gatewayUrl || !isSafeGatewayUrl(resData.gatewayUrl)) {
          throw new Error('Payment gateway is unavailable right now. Please try again or choose another method.');
        }
        redirecting = true;
        window.location.assign(resData.gatewayUrl);
        return;
      }

      persistLocally(resData.orderId || resData.id || orderId);
    } catch (error) {
      console.error('Failed to submit order:', error);
      if (!mountedRef.current) return;

      if (ORDER_FALLBACK_ENABLED && paymentMethod !== 'SSLCommerz') {
        persistLocally(orderId);
      } else {
        const aborted = error instanceof DOMException && error.name === 'AbortError';
        setSubmitError(
          aborted
            ? 'The request timed out. Please check your connection and try again.'
            : error instanceof Error && error.message
            ? error.message
            : 'Something went wrong while placing your order. Please try again.'
        );
      }
    } finally {
      clearTimeout(timeout);
      if (!redirecting && mountedRef.current) {
        submittingRef.current = false;
        setIsSubmitting(false);
      }
    }
  };

  /* ====================== SUCCESS SCREEN ====================== */
  if (orderSuccess) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-br from-[#FFF4F6] via-[#FDE6EC] to-[#FBD3DE] p-6">
        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#D81B7A]/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-[#C9A24B]/20 blur-3xl" />

        <div
          role="status"
          className="relative w-full max-w-lg rounded-3xl border border-[#F3C6D3] bg-white/90 p-8 text-center shadow-2xl shadow-[#B0124F]/15 backdrop-blur md:p-10"
        >
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-[#B0124F] to-[#D81B7A] text-3xl font-extrabold text-white shadow-lg shadow-[#B0124F]/40 ring-4 ring-[#E3B964]/60">
            ✓
          </div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#C9A24B]">Thank you</p>
          <h1 className="mb-2 font-serif text-3xl font-bold text-[#2E0A1C]">
            Order <span className="italic text-[#B0124F]">Confirmed!</span>
          </h1>
          <p className="mb-6 text-sm text-[#7A5566]">
            Thank you for shopping with us. Your order has been placed successfully.
          </p>

          <div className="mb-6 space-y-2 rounded-2xl border border-[#F3C6D3] bg-[#FFF4F6] p-4 text-left text-sm">
            <div className="flex justify-between">
              <span className="font-medium text-[#7A5566]">Order ID:</span>
              <span className="font-bold text-[#B0124F]">{completedOrderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-[#7A5566]">Customer Name:</span>
              <span className="font-semibold text-[#2E0A1C]">{fullName}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-[#7A5566]">Phone Number:</span>
              <span className="font-semibold text-[#2E0A1C]">{normalizePhone(phoneNumber)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-[#7A5566]">Payment Method:</span>
              <span className="font-semibold text-[#2E0A1C]">{paymentMethod}</span>
            </div>
            <div className="mt-2 flex items-center justify-between border-t border-[#E3B964]/50 pt-2">
              <span className="font-bold text-[#4A0F2E]">Total Amount:</span>
              <div>{formatPrice(grandTotalBDT)}</div>
            </div>
          </div>

          <button
            onClick={() => router.push('/')}
            className={`w-full rounded-full py-3.5 text-sm font-bold ${gradientBtn}`}
          >
            Continue Shopping →
          </button>
        </div>
      </div>
    );
  }

  /* ====================== EMPTY CART ====================== */
  if (cartReady && cartItems.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-[#FFF4F6] via-[#FDE6EC] to-[#FBD3DE] p-6">
        <div className="w-full max-w-md rounded-3xl border border-[#F3C6D3] bg-white/90 p-8 text-center shadow-xl shadow-[#B0124F]/10">
          <h1 className="mb-2 font-serif text-2xl font-bold text-[#2E0A1C]">Your cart is empty</h1>
          <p className="mb-6 text-sm text-[#7A5566]">Add some products to your cart before checking out.</p>
          <button
            onClick={() => router.push('/')}
            className={`w-full rounded-full py-3.5 text-sm font-bold ${gradientBtn}`}
          >
            Continue Shopping →
          </button>
        </div>
      </div>
    );
  }

  /* ====================== CHECKOUT FORM ====================== */
  const geoDisabled = postalStatus !== 'ready';

  return (
    <div className="min-h-screen bg-linear-to-br from-[#FFF4F6] via-[#FDE6EC] to-[#FBD3DE] px-4 py-10 md:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="mb-1 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#4A0F2E]">
              Secure Checkout
              <span className="hidden h-px w-16 bg-[#C9A24B] md:block" />
            </p>
            <h1 className="font-serif text-3xl font-bold text-[#2E0A1C] md:text-4xl">
              Checkout <span className="italic text-[#B0124F]">Information</span>
            </h1>
          </div>

          {/* Currency Switcher */}
          <div className="flex items-center gap-2 rounded-full border border-[#F3C6D3] bg-white px-4 py-2 shadow-sm">
            <label htmlFor="currency" className="text-xs font-bold uppercase tracking-wider text-[#4A0F2E]">
              Currency:
            </label>
            <select
              id="currency"
              value={currency}
              onChange={(e) => handleCurrencyChange(e.target.value as Currency)}
              className="cursor-pointer bg-transparent text-sm font-black text-[#B0124F] outline-none"
            >
              <option value="BDT">৳ BDT</option>
              <option value="USD">$ USD</option>
            </select>
          </div>
        </div>

        <form
          onSubmit={handleOrderSubmit}
          noValidate
          aria-busy={isSubmitting}
          className="grid grid-cols-1 gap-8 lg:grid-cols-3"
        >
          {/* Main Customer Details Form */}
          <div className="space-y-6 rounded-3xl border border-[#F3C6D3] bg-white/95 p-6 shadow-xl shadow-[#B0124F]/10 md:p-8 lg:col-span-2">
            <h2 className="border-b border-[#E3B964]/50 pb-3 font-serif text-xl font-semibold text-[#4A0F2E]">
              Shipping &amp; Contact Details
            </h2>

            {/* Name & Phone */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="fullName" className={labelCls}>Full Name *</label>
                <input
                  id="fullName"
                  type="text"
                  autoComplete="name"
                  maxLength={80}
                  value={fullName}
                  onChange={bind('fullName', setFullName)}
                  placeholder="Enter your full name"
                  className={cls('fullName')}
                  {...aria('fullName')}
                />
                <FieldError id="fullName" msg={errors.fullName} />
              </div>
              <div>
                <label htmlFor="phone" className={labelCls}>Phone Number *</label>
                <input
                  id="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  maxLength={16}
                  value={phoneNumber}
                  onChange={bind('phone', setPhoneNumber)}
                  placeholder="01XXXXXXXXX"
                  className={cls('phone')}
                  {...aria('phone')}
                />
                <FieldError id="phone" msg={errors.phone} />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className={labelCls}>Email Address</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                maxLength={120}
                value={emailAddress}
                onChange={bind('email', setEmailAddress)}
                placeholder="name@example.com"
                className={cls('email')}
                {...aria('email')}
              />
              <FieldError id="email" msg={errors.email} />
            </div>

            {/* Village & Address */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="village" className={labelCls}>Village / Area / House *</label>
                <input
                  id="village"
                  type="text"
                  maxLength={100}
                  value={village}
                  onChange={bind('village', setVillage)}
                  placeholder="Enter village or area name"
                  className={cls('village')}
                  {...aria('village')}
                />
                <FieldError id="village" msg={errors.village} />
              </div>
              <div>
                <label htmlFor="address" className={labelCls}>Detailed Address *</label>
                <input
                  id="address"
                  type="text"
                  autoComplete="street-address"
                  maxLength={200}
                  value={detailedAddress}
                  onChange={bind('address', setDetailedAddress)}
                  placeholder="Street address, landmarks, etc."
                  className={cls('address')}
                  {...aria('address')}
                />
                <FieldError id="address" msg={errors.address} />
              </div>
            </div>

            {/* Location data status */}
            {postalStatus === 'loading' && (
              <p className="text-xs text-[#7A5566]" role="status">Loading location data…</p>
            )}
            {postalStatus === 'error' && (
              <div role="alert" className="flex items-center justify-between gap-3 rounded-xl border border-[#D6264F]/40 bg-[#FFF0F3] px-4 py-2.5 text-xs text-[#C0143C]">
                <span>Could not load location data. Check your connection and try again.</span>
                <button
                  type="button"
                  onClick={fetchPostalData}
                  className="rounded-full bg-[#B0124F] px-3 py-1 font-bold text-white hover:bg-[#990F44]"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Division & District */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="division" className={labelCls}>Select Division *</label>
                <select
                  id="division"
                  disabled={geoDisabled}
                  value={division}
                  onChange={(e) => {
                    setDivision(e.target.value);
                    setDistrict('');
                    setUpazila('');
                    setPostalValue('');
                    setManualPostal('');
                    clearError('division');
                  }}
                  className={cls('division')}
                  {...aria('division')}
                >
                  <option value="">-- Choose Division --</option>
                  {(postalIndex?.divisions ?? []).map((div) => (
                    <option key={div} value={div}>{div}</option>
                  ))}
                </select>
                <FieldError id="division" msg={errors.division} />
              </div>
              <div>
                <label htmlFor="district" className={labelCls}>Select District *</label>
                <select
                  id="district"
                  disabled={geoDisabled || !division}
                  value={district}
                  onChange={(e) => {
                    setDistrict(e.target.value);
                    setUpazila('');
                    setPostalValue('');
                    setManualPostal('');
                    clearError('district');
                  }}
                  className={cls('district')}
                  {...aria('district')}
                >
                  <option value="">-- Choose District --</option>
                  {districtList.map((dist) => (
                    <option key={dist} value={dist}>{dist}</option>
                  ))}
                </select>
                <FieldError id="district" msg={errors.district} />
              </div>
            </div>

            {/* Upazila & Postal Code */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="upazila" className={labelCls}>Select Thana / Upazila *</label>
                <select
                  id="upazila"
                  disabled={geoDisabled || !district}
                  value={upazila}
                  onChange={(e) => {
                    const next = e.target.value;
                    setUpazila(next);
                    setManualPostal('');
                    const list =
                      postalIndex && next ? postalIndex.offices[officeKey(district, next)] ?? [] : [];
                    // একটিমাত্র পোস্ট অফিস থাকলে অটো-সিলেক্ট
                    setPostalValue(list.length === 1 ? encodeOffice(list[0]) : '');
                    clearError('upazila');
                    clearError('postal');
                    clearError('postalManual');
                  }}
                  className={cls('upazila')}
                  {...aria('upazila')}
                >
                  <option value="">-- Choose Thana / Upazila --</option>
                  {thanaList.map((name) => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
                <FieldError id="upazila" msg={errors.upazila} />
              </div>

              <div>
                <label htmlFor="postal" className={labelCls}>Post Office / Postal Code</label>

                {!upazila ? (
                  <input
                    id="postal"
                    type="text"
                    disabled
                    placeholder="-- Choose Thana / Upazila First --"
                    className={inputCls}
                  />
                ) : (
                  <div className="space-y-2">
                    {offices.length > 0 && (
                      <select
                        id="postal"
                        value={postalValue}
                        onChange={(e) => {
                          setPostalValue(e.target.value);
                          clearError('postal');
                          clearError('postalManual');
                        }}
                        className={cls('postal')}
                        {...aria('postal')}
                      >
                        <option value="">-- Choose Post Office --</option>
                        {offices.map((o) => (
                          <option key={encodeOffice(o)} value={encodeOffice(o)}>
                            {o.code} — {o.name}
                          </option>
                        ))}
                        <option value={OTHER_POSTAL}>Not listed — enter code manually</option>
                      </select>
                    )}

                    {manualPostalMode && (
                      <input
                        id={offices.length > 0 ? 'postalManual' : 'postal'}
                        type="text"
                        inputMode="numeric"
                        autoComplete="postal-code"
                        maxLength={4}
                        value={manualPostal}
                        onChange={(e) => {
                          setManualPostal(e.target.value.replace(/\D/g, ''));
                          clearError('postal');
                          clearError('postalManual');
                        }}
                        placeholder="4-digit postal code"
                        className={cls(offices.length > 0 ? 'postalManual' : 'postal')}
                        {...aria(offices.length > 0 ? 'postalManual' : 'postal')}
                      />
                    )}
                  </div>
                )}
                <FieldError id="postal" msg={errors.postal} />
                <FieldError id="postalManual" msg={errors.postalManual} />
              </div>
            </div>

            {/* Payment Options */}
            <div className="border-t border-[#E3B964]/50 pt-5">
              <p id="payment-heading" className="mb-3 font-serif text-lg font-semibold text-[#4A0F2E]">
                Select Payment Method
              </p>
              <div role="radiogroup" aria-labelledby="payment-heading" className="space-y-3">
                {PAYMENT_METHODS.map((method) => {
                  const isActive = paymentMethod === method.value;
                  return (
                    <label
                      key={method.value}
                      className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-3.5 transition ${
                        isActive
                          ? 'border-[#B0124F] bg-[#FDE6EC] ring-1 ring-[#B0124F]'
                          : 'border-[#F3C6D3] bg-white hover:bg-[#FFF4F6]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.value}
                        checked={isActive}
                        onChange={(e) => {
                          setPaymentMethod(e.target.value);
                          setSubmitError('');
                        }}
                        className="h-4 w-4 accent-[#B0124F]"
                      />
                      <span className="text-sm font-medium text-[#2E0A1C]">{method.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {paymentMethod === 'SSLCommerz' && (
              <div className="space-y-2 rounded-2xl border border-[#B0124F]/30 bg-[#FFF4F6] p-4 text-xs text-[#4A0F2E]">
                <p className="font-bold text-[#B0124F]">💳 SSLCommerz Secure Gateway</p>
                <p>
                  অর্ডার কনফার্ম করার পর আপনাকে ভিসা, মাস্টারকার্ড, বিকাশ, নগদ বা যেকোনো ব্যাংক কার্ড দিয়ে পেমেন্ট করার জন্য রিডাইরেক্ট করা হবে।
                </p>
              </div>
            )}

            {paymentMethod === 'bKash' && (
              <div className="space-y-3 rounded-2xl border border-[#E8A3BC] bg-[#FDE6EC] p-4">
                <p className="text-xs font-semibold text-[#B0124F]">
                  Please Send Money to 01700000000 and enter details below:
                </p>
                <div>
                  <input
                    id="bkashNumber"
                    type="tel"
                    inputMode="tel"
                    maxLength={16}
                    value={bkashNumber}
                    onChange={bind('bkashNumber', setBkashNumber)}
                    placeholder="Your bKash Mobile Number"
                    aria-label="Your bKash Mobile Number"
                    className={cls('bkashNumber')}
                    {...aria('bkashNumber')}
                  />
                  <FieldError id="bkashNumber" msg={errors.bkashNumber} />
                </div>
                <div>
                  <input
                    id="bkashTrx"
                    type="text"
                    autoCapitalize="characters"
                    maxLength={20}
                    value={bkashTrxId}
                    onChange={bind('bkashTrx', setBkashTrxId)}
                    placeholder="Transaction ID (TrxID)"
                    aria-label="bKash Transaction ID"
                    className={cls('bkashTrx')}
                    {...aria('bkashTrx')}
                  />
                  <FieldError id="bkashTrx" msg={errors.bkashTrx} />
                </div>
              </div>
            )}

            {paymentMethod === 'Nagad' && (
              <div className="space-y-3 rounded-2xl border border-[#E3B964] bg-[#FBF1D9] p-4">
                <p className="text-xs font-semibold text-[#7A5A12]">
                  Please Send Money to 01700000000 and enter details below:
                </p>
                <div>
                  <input
                    id="nagadNumber"
                    type="tel"
                    inputMode="tel"
                    maxLength={16}
                    value={nagadNumber}
                    onChange={bind('nagadNumber', setNagadNumber)}
                    placeholder="Your Nagad Mobile Number"
                    aria-label="Your Nagad Mobile Number"
                    className={cls('nagadNumber')}
                    {...aria('nagadNumber')}
                  />
                  <FieldError id="nagadNumber" msg={errors.nagadNumber} />
                </div>
                <div>
                  <input
                    id="nagadTrx"
                    type="text"
                    autoCapitalize="characters"
                    maxLength={20}
                    value={nagadTrxId}
                    onChange={bind('nagadTrx', setNagadTrxId)}
                    placeholder="Transaction ID (TrxID)"
                    aria-label="Nagad Transaction ID"
                    className={cls('nagadTrx')}
                    {...aria('nagadTrx')}
                  />
                  <FieldError id="nagadTrx" msg={errors.nagadTrx} />
                </div>
              </div>
            )}

            {paymentMethod === 'Cellfin (IBBL)' && (
              <div className="space-y-2 rounded-2xl border border-[#C79AB0] bg-[#F6E3EB] p-4">
                <label htmlFor="cellfin" className="block text-xs font-semibold text-[#4A0F2E]">
                  Cellfin Account Number or TrxID
                </label>
                <input
                  id="cellfin"
                  type="text"
                  maxLength={40}
                  value={cellfinAccount}
                  onChange={bind('cellfin', setCellfinAccount)}
                  placeholder="Enter your Cellfin account or TrxID"
                  className={cls('cellfin')}
                  {...aria('cellfin')}
                />
                <FieldError id="cellfin" msg={errors.cellfin} />
              </div>
            )}

            {submitError && (
              <div
                role="alert"
                className="rounded-2xl border border-[#D6264F]/40 bg-[#FFF0F3] px-4 py-3 text-sm font-medium text-[#C0143C]"
              >
                {submitError}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || !cartReady || postalStatus === 'loading'}
              className={`w-full rounded-full py-4 text-base font-bold disabled:cursor-not-allowed disabled:opacity-60 ${gradientBtn}`}
            >
              {isSubmitting ? 'Processing Order...' : 'Complete Order →'}
            </button>
          </div>

          {/* Order Summary Sidebar */}
          <aside className="h-fit space-y-4 overflow-hidden rounded-3xl border border-[#E3B964]/60 bg-linear-to-b from-[#4A0F2E] to-[#2E0A1C] p-6 text-white shadow-xl shadow-[#4A0F2E]/30 lg:sticky lg:top-6">
            <h2 className="border-b border-[#E3B964]/40 pb-3 font-serif text-lg font-bold text-[#E3B964]">
              Order Summary
            </h2>

            <div className="space-y-3">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-semibold text-white">{item.title}</p>
                    <p className="text-xs text-[#F3C6D3]">Qty: {item.quantity}</p>
                  </div>
                  <div>{formatPrice(item.priceBDT * item.quantity)}</div>
                </div>
              ))}
            </div>

            <div className="space-y-2 border-t border-[#E3B964]/40 pt-3 text-sm">
              <div className="flex items-center justify-between text-[#F3C6D3]">
                <span>Subtotal</span>
                <div>{formatPrice(subtotalBDT)}</div>
              </div>
              <div className="flex items-center justify-between text-[#F3C6D3]">
                <span>Delivery Charge</span>
                <div>{formatPrice(DELIVERY_CHARGE_BDT)}</div>
              </div>
              <div className="flex items-center justify-between border-t border-[#E3B964]/40 pt-3 text-base font-bold">
                <span className="text-white">Total</span>
                <div className="text-lg text-[#E3B964]">{formatPrice(grandTotalBDT)}</div>
              </div>
            </div>

            <p className="pt-1 text-center text-[11px] text-[#F3C6D3]/80">
              🔒 100% secure checkout · 24/7 customer support
            </p>
          </aside>
        </form>
      </div>
    </div>
  );
}