'use client';

// app/apps/e-commerce/page.tsx
// আসল অর্ডারের স্টোর। দাম, স্টক, ডিসকাউন্ট, ভ্যাট, শিপিং ও কুপন সবকিছু সার্ভার থেকে আসে এবং সার্ভারেই হিসাব হয়।
// ব্রাউজারে শুধু কার্টের (প্রোডাক্ট আইডি, পরিমাণ, রং, সাইজ) সংরক্ষিত থাকে, দাম নয়।

import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';

type StoreProduct = {
  id: string;
  slug: string;
  name: string;
  sku: string;
  image: string;
  category: string;
  brand: string;
  price: number;
  discount: number;
  finalPrice: number;
  stock: number;
  sold: number;
  rating: number;
  colors: string[];
  sizes: string[];
  tags: string[];
  featured: boolean;
  flashSale: boolean;
};

type ShippingOption = { key: string; label: string; charge: number };
type PaymentOption = { method: string; number?: string; needsTrxId: boolean };
type StoreConfig = {
  shipping: ShippingOption[];
  payments: PaymentOption[];
  vatPercent: number;
  maxQtyPerLine: number;
  couponsEnabled: boolean;
};
type CartLine = { productId: string; quantity: number; color: string; size: string };
type Quote = {
  subtotal: number;
  productSavings: number;
  couponCode: string | null;
  couponDiscount: number;
  vat: number;
  shipping: number;
  total: number;
};
type PlacedOrder = { orderNumber: string; total: number; paymentMethod: string; payTo: string | null };
type TrackedOrder = {
  orderNumber: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  total: number;
  items: { name: string; quantity: number; unitPrice: number }[];
};

const STEPS = ['Pending', 'Processing', 'Packaging', 'Shipped', 'Delivered'];
const STEP_BN: Record<string, string> = {
  Pending: 'গৃহীত',
  Processing: 'প্রসেসিং',
  Packaging: 'প্যাকেজিং',
  Shipped: 'শিপড',
  Delivered: 'ডেলিভারড',
  Cancelled: 'বাতিল',
};

const KEY_CART = 'sf-cart-v2';
const KEY_WISH = 'sf-wishlist-v2';
const KEY_CMP = 'sf-compare-v2';

const money = (n: number) => `৳ ${Number(n || 0).toLocaleString('en-BD', { maximumFractionDigits: 2 })}`;
const lineKey = (l: { productId: string; color: string; size: string }) => `${l.productId}|${l.color}|${l.size}`;

function readJson<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}
function writeJson(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* স্টোরেজ ভর্তি/বন্ধ থাকলে উপেক্ষা */
  }
}

function sanitizeCart(raw: unknown): CartLine[] {
  if (!Array.isArray(raw)) return [];
  const out: CartLine[] = [];
  for (const r of raw) {
    if (!r || typeof r !== 'object') continue;
    const x = r as Record<string, unknown>;
    const quantity = Number(x.quantity);
    if (typeof x.productId !== 'string' || !Number.isInteger(quantity) || quantity < 1) continue;
    out.push({
      productId: x.productId,
      quantity,
      color: typeof x.color === 'string' ? x.color : '',
      size: typeof x.size === 'string' ? x.size : '',
    });
  }
  return out.slice(0, 30);
}

const input =
  'w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:ring-4 focus:ring-blue-200';

export default function EcommercePage() {
  // ---------------------------------------------------------------- state
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [config, setConfig] = useState<StoreConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [reload, setReload] = useState(0);
  const [hydrated, setHydrated] = useState(false);

  const [cart, setCart] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [compare, setCompare] = useState<string[]>([]);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sortBy, setSortBy] = useState('default');
  const [colorFilter, setColorFilter] = useState('');
  const [sizeFilter, setSizeFilter] = useState('');
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const [showCart, setShowCart] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  const [showCompare, setShowCompare] = useState(false);
  const [quickId, setQuickId] = useState<string | null>(null);
  const [qvColor, setQvColor] = useState('');
  const [qvSize, setQvSize] = useState('');
  const [qvQty, setQvQty] = useState(1);

  const [toast, setToast] = useState('');

  const [shippingKey, setShippingKey] = useState('');
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [quote, setQuote] = useState<Quote | null>(null);
  const [quoting, setQuoting] = useState(false);
  const [quoteErr, setQuoteErr] = useState('');

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [payMethod, setPayMethod] = useState('');
  const [trxId, setTrxId] = useState('');
  const [placing, setPlacing] = useState(false);
  const [checkoutErr, setCheckoutErr] = useState('');
  const [placed, setPlaced] = useState<PlacedOrder | null>(null);

  const [trackNo, setTrackNo] = useState('');
  const [trackPhone, setTrackPhone] = useState('');
  const [tracking, setTracking] = useState(false);
  const [trackErr, setTrackErr] = useState('');
  const [tracked, setTracked] = useState<TrackedOrder | null>(null);

  const notify = useCallback((m: string) => {
    setToast(m);
    window.setTimeout(() => setToast((cur) => (cur === m ? '' : cur)), 3000);
  }, []);

  // ---------------------------------------------------------------- load
  useEffect(() => {
    setCart(sanitizeCart(readJson<unknown>(KEY_CART, [])));
    const w = readJson<unknown>(KEY_WISH, []);
    const c = readJson<unknown>(KEY_CMP, []);
    setWishlist(Array.isArray(w) ? w.filter((x): x is string => typeof x === 'string').slice(0, 100) : []);
    setCompare(Array.isArray(c) ? c.filter((x): x is string => typeof x === 'string').slice(0, 3) : []);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) writeJson(KEY_CART, cart);
  }, [cart, hydrated]);
  useEffect(() => {
    if (hydrated) writeJson(KEY_WISH, wishlist);
  }, [wishlist, hydrated]);
  useEffect(() => {
    if (hydrated) writeJson(KEY_CMP, compare);
  }, [compare, hydrated]);

  useEffect(() => {
    const ctrl = new AbortController();
    setLoading(true);
    setLoadError('');
    fetch('/api/e-commerce', { cache: 'no-store', signal: ctrl.signal })
      .then((r) => r.json())
      .then((d) => {
        if (!d?.success) throw new Error(d?.error || 'load failed');
        setProducts(Array.isArray(d.products) ? d.products : []);
        const cfg = d.config as StoreConfig;
        setConfig(cfg);
        setShippingKey((cur) => cur || cfg.shipping[0]?.key || '');
        setPayMethod((cur) => cur || cfg.payments[0]?.method || '');
      })
      .catch((e: unknown) => {
        if ((e as Error)?.name !== 'AbortError') setLoadError('প্রোডাক্ট লোড করা যায়নি। ইন্টারনেট দেখে আবার চেষ্টা করুন।');
      })
      .finally(() => {
        if (!ctrl.signal.aborted) setLoading(false);
      });
    return () => ctrl.abort();
  }, [reload]);

  const byId = useMemo(() => new Map(products.map((p) => [p.id, p])), [products]);

  // কার্ট, উইশলিস্ট ও কম্পেয়ার সার্ভারের সর্বশেষ ডেটার সাথে মেলানো (মুছে যাওয়া প্রোডাক্ট/স্টক/অপশন)
  useEffect(() => {
    if (!hydrated || loading || loadError || !config) return;
    setCart((prev) => {
      const remaining = new Map(products.map((p) => [p.id, p.stock]));
      const next: CartLine[] = [];
      for (const l of prev) {
        const p = byId.get(l.productId);
        if (!p) continue;
        const color = p.colors.length ? l.color : '';
        const size = p.sizes.length ? l.size : '';
        if ((p.colors.length && !p.colors.includes(color)) || (p.sizes.length && !p.sizes.includes(size))) continue;
        const left = remaining.get(p.id) ?? 0;
        const quantity = Math.min(l.quantity, config.maxQtyPerLine, left);
        if (quantity < 1) continue;
        remaining.set(p.id, left - quantity);
        next.push({ productId: l.productId, quantity, color, size });
      }
      const same =
        next.length === prev.length &&
        next.every((n, i) => lineKey(n) === lineKey(prev[i]) && n.quantity === prev[i].quantity);
      return same ? prev : next;
    });
    setWishlist((prev) => {
      const next = prev.filter((id) => byId.has(id));
      return next.length === prev.length ? prev : next;
    });
    setCompare((prev) => {
      const next = prev.filter((id) => byId.has(id));
      return next.length === prev.length ? prev : next;
    });
  }, [hydrated, loading, loadError, config, products, byId]);

  // ---------------------------------------------------------------- server quote
  useEffect(() => {
    if (!config || !shippingKey || cart.length === 0) {
      setQuote(null);
      setQuoteErr('');
      setQuoting(false);
      return;
    }
    const ctrl = new AbortController();
    setQuoting(true);
    const t = window.setTimeout(async () => {
      try {
        const res = await fetch('/api/e-commerce?action=quote', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: cart, shippingKey, couponCode: appliedCoupon }),
          signal: ctrl.signal,
        });
        const d = await res.json();
        if (d.success) {
          setQuote(d.quote as Quote);
          setQuoteErr('');
        } else {
          setQuote(null);
          setQuoteErr(d.error || 'হিসাব করা যায়নি');
          if (appliedCoupon && typeof d.error === 'string' && d.error.includes('কুপন')) setAppliedCoupon('');
        }
      } catch (e) {
        if ((e as Error)?.name !== 'AbortError') setQuoteErr('নেটওয়ার্ক সমস্যা, আবার চেষ্টা করুন');
      } finally {
        if (!ctrl.signal.aborted) setQuoting(false);
      }
    }, 300);
    return () => {
      window.clearTimeout(t);
      ctrl.abort();
    };
  }, [cart, shippingKey, appliedCoupon, config]);

  // Escape চাপলে সবচেয়ে উপরের প্যানেল বন্ধ
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (quickId) setQuickId(null);
      else if (placed) setPlaced(null);
      else if (showCompare) setShowCompare(false);
      else if (showWishlist) setShowWishlist(false);
      else if (showCart) setShowCart(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [quickId, placed, showCompare, showWishlist, showCart]);

  // ---------------------------------------------------------------- derived
  const categories = useMemo(() => ['All', ...Array.from(new Set(products.map((p) => p.category)))], [products]);
  const allColors = useMemo(() => Array.from(new Set(products.flatMap((p) => p.colors))), [products]);
  const allSizes = useMemo(() => Array.from(new Set(products.flatMap((p) => p.sizes))), [products]);

  const filtered = useMemo(() => {
    let list = [...products];
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter((p) => [p.name, p.category, p.brand, p.sku, ...p.tags].join(' ').toLowerCase().includes(q));
    }
    if (category !== 'All') list = list.filter((p) => p.category === category);
    if (colorFilter) list = list.filter((p) => p.colors.includes(colorFilter));
    if (sizeFilter) list = list.filter((p) => p.sizes.includes(sizeFilter));
    if (sortBy === 'low-high') list.sort((a, b) => a.finalPrice - b.finalPrice);
    if (sortBy === 'high-low') list.sort((a, b) => b.finalPrice - a.finalPrice);
    if (sortBy === 'rating') list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [products, search, category, colorFilter, sizeFilter, sortBy]);

  const cartCount = cart.reduce((s, l) => s + l.quantity, 0);
  const quick = quickId ? byId.get(quickId) ?? null : null;
  const payOption = config?.payments.find((p) => p.method === payMethod);

  // ---------------------------------------------------------------- actions
  const addToCart = useCallback(
    (p: StoreProduct, opts?: { color?: string; size?: string; qty?: number }): boolean => {
      if (!config) return false;
      const color = p.colors.length ? opts?.color ?? '' : '';
      const size = p.sizes.length ? opts?.size ?? '' : '';
      const qty = opts?.qty ?? 1;
      if (p.colors.length && !color) {
        notify('রং বেছে নিন');
        return false;
      }
      if (p.sizes.length && !size) {
        notify('সাইজ বেছে নিন');
        return false;
      }
      const inCart = cart.filter((l) => l.productId === p.id).reduce((s, l) => s + l.quantity, 0);
      if (p.stock <= 0) {
        notify('স্টক শেষ');
        return false;
      }
      if (inCart + qty > p.stock) {
        notify(`মাত্র ${p.stock} টি আছে`);
        return false;
      }
      const key = lineKey({ productId: p.id, color, size });
      const existing = cart.find((l) => lineKey(l) === key);
      if (existing && existing.quantity + qty > config.maxQtyPerLine) {
        notify(`একটি আইটেম সর্বোচ্চ ${config.maxQtyPerLine} টি নেওয়া যায়`);
        return false;
      }
      setCart((prev) => {
        const found = prev.find((l) => lineKey(l) === key);
        if (found) return prev.map((l) => (lineKey(l) === key ? { ...l, quantity: l.quantity + qty } : l));
        return [...prev, { productId: p.id, quantity: qty, color, size }];
      });
      notify(`${p.name} কার্টে যোগ হয়েছে`);
      return true;
    },
    [cart, config, notify]
  );

  function changeQty(line: CartLine, delta: number) {
    const p = byId.get(line.productId);
    if (!p || !config) return;
    const next = line.quantity + delta;
    const others = cart.filter((l) => l.productId === p.id && lineKey(l) !== lineKey(line)).reduce((s, l) => s + l.quantity, 0);
    if (next < 1) return;
    if (next > config.maxQtyPerLine) return notify(`সর্বোচ্চ ${config.maxQtyPerLine} টি`);
    if (others + next > p.stock) return notify(`মাত্র ${p.stock} টি আছে`);
    setCart((prev) => prev.map((l) => (lineKey(l) === lineKey(line) ? { ...l, quantity: next } : l)));
  }

  const removeLine = (line: CartLine) => setCart((prev) => prev.filter((l) => lineKey(l) !== lineKey(line)));

  function toggleWish(id: string) {
    setWishlist((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function toggleCompare(id: string) {
    if (compare.includes(id)) return setCompare((prev) => prev.filter((x) => x !== id));
    if (compare.length >= 3) return notify('সর্বোচ্চ ৩টি প্রোডাক্ট তুলনা করা যায়');
    setCompare((prev) => [...prev, id]);
  }

  function openQuick(p: StoreProduct) {
    setQuickId(p.id);
    setQvColor(p.colors.length === 1 ? p.colors[0] : '');
    setQvSize(p.sizes.length === 1 ? p.sizes[0] : '');
    setQvQty(1);
  }

  function handleCardAdd(p: StoreProduct) {
    if (p.colors.length || p.sizes.length) openQuick(p);
    else addToCart(p);
  }

  function applyCoupon() {
    const code = couponInput.trim().toUpperCase();
    if (!code) return;
    setAppliedCoupon(code);
  }

  async function placeOrder(e: FormEvent) {
    e.preventDefault();
    if (placing || !config) return;
    setCheckoutErr('');
    if (cart.length === 0) return setCheckoutErr('কার্ট খালি');
    setPlacing(true);
    try {
      const res = await fetch('/api/e-commerce', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: { name, phone, address },
          items: cart,
          paymentMethod: payMethod,
          paymentTrxId: trxId,
          couponCode: appliedCoupon,
          shippingKey,
        }),
      });
      const d = await res.json();
      if (d.success) {
        setPlaced(d.order as PlacedOrder);
        setCart([]);
        setAppliedCoupon('');
        setCouponInput('');
        setTrxId('');
        setShowCart(false);
        setReload((n) => n + 1); // সর্বশেষ স্টক আনা
      } else {
        setCheckoutErr(d.error || 'অর্ডার সম্পন্ন হয়নি');
        if (res.status === 409) setReload((n) => n + 1);
      }
    } catch {
      setCheckoutErr('নেটওয়ার্ক সমস্যা। অর্ডার হয়েছে কি না নিশ্চিত না হলে আবার চাপার আগে আমাদের জানান।');
    } finally {
      setPlacing(false);
    }
  }

  async function trackOrder(e: FormEvent) {
    e.preventDefault();
    setTrackErr('');
    setTracked(null);
    setTracking(true);
    try {
      const qs = new URLSearchParams({ order: trackNo.trim(), phone: trackPhone.trim() });
      const res = await fetch(`/api/e-commerce?${qs.toString()}`, { cache: 'no-store' });
      const d = await res.json();
      if (d.success) setTracked(d.order as TrackedOrder);
      else setTrackErr(d.error || 'অর্ডার পাওয়া যায়নি');
    } catch {
      setTrackErr('নেটওয়ার্ক সমস্যা');
    } finally {
      setTracking(false);
    }
  }

  function resetFilters() {
    setSearch('');
    setCategory('All');
    setSortBy('default');
    setColorFilter('');
    setSizeFilter('');
  }

  // ---------------------------------------------------------------- render
  return (
    <div className="py-6">
      {toast && (
        <div role="status" aria-live="polite" className="fixed right-4 top-4 z-[9999] max-w-xs rounded-2xl bg-black px-5 py-3 text-sm font-bold text-white shadow-2xl">
          {toast}
        </div>
      )}

      {/* টপ বার */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <h1 className="mr-auto text-3xl font-black text-slate-900">অনলাইন শপ</h1>
        <button onClick={() => setShowCompare(true)} className="rounded-xl bg-amber-400 px-4 py-2.5 text-sm font-bold text-black hover:bg-amber-300">
          তুলনা ({compare.length})
        </button>
        <button onClick={() => setShowWishlist(true)} className="rounded-xl bg-pink-500 px-4 py-2.5 text-sm font-bold text-white hover:bg-pink-600">
          পছন্দের তালিকা ({wishlist.length})
        </button>
        <button onClick={() => setShowCart(true)} className="rounded-xl bg-green-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-green-700">
          কার্ট ({cartCount})
        </button>
      </div>

      {/* ফিল্টার */}
      <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
          <input
            className={`${input} xl:col-span-2`}
            placeholder="প্রোডাক্ট, ব্র্যান্ড, SKU, ট্যাগ খুঁজুন"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="প্রোডাক্ট খুঁজুন"
          />
          <select className={input} value={category} onChange={(e) => setCategory(e.target.value)} aria-label="ক্যাটেগরি">
            {categories.map((c) => (
              <option key={c} value={c}>{c === 'All' ? 'সব ক্যাটেগরি' : c}</option>
            ))}
          </select>
          <select className={input} value={sortBy} onChange={(e) => setSortBy(e.target.value)} aria-label="সাজান">
            <option value="default">ডিফল্ট</option>
            <option value="low-high">দাম: কম থেকে বেশি</option>
            <option value="high-low">দাম: বেশি থেকে কম</option>
            <option value="rating">সর্বোচ্চ রেটিং</option>
          </select>
          <select className={input} value={colorFilter} onChange={(e) => setColorFilter(e.target.value)} aria-label="রং">
            <option value="">সব রং</option>
            {allColors.map((c) => <option key={c}>{c}</option>)}
          </select>
          <select className={input} value={sizeFilter} onChange={(e) => setSizeFilter(e.target.value)} aria-label="সাইজ">
            <option value="">সব সাইজ</option>
            {allSizes.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600">
          <span>{products.length} টির মধ্যে {filtered.length} টি দেখানো হচ্ছে</span>
          <div className="flex gap-2">
            <button onClick={resetFilters} className="rounded-lg border border-slate-300 px-3 py-1.5 font-bold hover:bg-slate-100">ফিল্টার মুছুন</button>
            <button onClick={() => setView('grid')} className={`rounded-lg px-3 py-1.5 font-bold ${view === 'grid' ? 'bg-slate-900 text-white' : 'bg-slate-100'}`}>গ্রিড</button>
            <button onClick={() => setView('list')} className={`rounded-lg px-3 py-1.5 font-bold ${view === 'list' ? 'bg-slate-900 text-white' : 'bg-slate-100'}`}>লিস্ট</button>
          </div>
        </div>
      </section>

      {/* প্রোডাক্ট */}
      <section aria-label="প্রোডাক্ট তালিকা" className="mb-16">
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4" aria-busy="true">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-96 animate-pulse rounded-2xl bg-slate-200" />
            ))}
          </div>
        ) : loadError ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-10 text-center">
            <p className="font-bold text-red-700">{loadError}</p>
            <button onClick={() => setReload((n) => n + 1)} className="mt-4 rounded-xl bg-red-600 px-5 py-2.5 font-bold text-white hover:bg-red-700">আবার চেষ্টা করুন</button>
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-16 text-center text-slate-500">
            <div className="mb-3 text-5xl">🛍️</div>
            <p className="font-bold">শীঘ্রই প্রোডাক্ট আসছে</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-16 text-center">
            <div className="mb-3 text-5xl">🔎</div>
            <p className="text-xl font-black">কোনো প্রোডাক্ট পাওয়া যায়নি</p>
            <button onClick={resetFilters} className="mt-4 rounded-xl bg-slate-900 px-5 py-2.5 font-bold text-white">ফিল্টার মুছুন</button>
          </div>
        ) : (
          <div className={`grid gap-6 ${view === 'grid' ? 'sm:grid-cols-2 xl:grid-cols-4' : 'grid-cols-1'}`}>
            {filtered.map((p) => {
              const out = p.stock <= 0;
              return (
                <article
                  key={p.id}
                  className={`overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-lg ${view === 'list' ? 'md:grid md:grid-cols-[260px_1fr]' : ''}`}
                >
                  <div className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.image} alt={p.name} loading="lazy" className={`w-full bg-slate-100 object-cover ${view === 'list' ? 'h-full min-h-60' : 'h-64'} ${out ? 'opacity-50' : ''}`} />
                    {p.featured && <span className="absolute left-3 top-3 rounded-full bg-yellow-400 px-3 py-1 text-xs font-bold text-black">Featured</span>}
                    {p.flashSale && <span className="absolute right-3 top-3 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white">Flash Sale</span>}
                    {p.discount > 0 && <span className="absolute bottom-3 left-3 rounded-full bg-green-600 px-3 py-1 text-xs font-bold text-white">{p.discount}% ছাড়</span>}
                    {out && <span className="absolute inset-0 flex items-center justify-center text-xl font-black text-slate-900">স্টক শেষ</span>}
                  </div>
                  <div className="flex flex-col p-5">
                    <h2 className="text-lg font-black text-slate-900">{p.name}</h2>
                    <p className="text-sm text-slate-500">{p.category}{p.brand ? ` · ${p.brand}` : ''}</p>
                    <div className="mt-2 flex items-center justify-between text-sm">
                      <span className="font-bold text-amber-500">⭐ {p.rating.toFixed(1)}</span>
                      <span className={p.stock > 0 && p.stock <= 5 ? 'font-bold text-red-600' : 'text-slate-500'}>
                        {out ? 'স্টক নেই' : p.stock <= 5 ? `মাত্র ${p.stock} টি বাকি` : 'স্টকে আছে'}
                      </span>
                    </div>
                    <p className="mt-3 text-2xl font-black text-green-700">
                      {money(p.finalPrice)}
                      {p.discount > 0 && <span className="ml-2 text-sm font-bold text-slate-400 line-through">{money(p.price)}</span>}
                    </p>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <button disabled={out} onClick={() => handleCardAdd(p)} className="rounded-xl bg-slate-900 py-2.5 text-sm font-bold text-white hover:bg-black disabled:cursor-not-allowed disabled:opacity-40">
                        {p.colors.length || p.sizes.length ? 'অপশন বেছে নিন' : 'কার্টে যোগ করুন'}
                      </button>
                      <button onClick={() => openQuick(p)} className="rounded-xl bg-blue-600 py-2.5 text-sm font-bold text-white hover:bg-blue-700">বিস্তারিত</button>
                      <button onClick={() => toggleWish(p.id)} className={`rounded-xl py-2.5 text-sm font-bold ${wishlist.includes(p.id) ? 'bg-pink-600 text-white' : 'bg-pink-100 text-pink-700 hover:bg-pink-200'}`}>
                        {wishlist.includes(p.id) ? '♥ পছন্দের' : '♡ পছন্দ'}
                      </button>
                      <button onClick={() => toggleCompare(p.id)} className={`rounded-xl py-2.5 text-sm font-bold ${compare.includes(p.id) ? 'bg-amber-500 text-black' : 'bg-amber-100 text-amber-800 hover:bg-amber-200'}`}>
                        {compare.includes(p.id) ? '✓ তুলনায়' : 'তুলনা'}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* অর্ডার ট্র্যাকিং */}
      <section aria-labelledby="track" className="mx-auto mb-10 max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 id="track" className="text-xl font-black text-slate-900">অর্ডার ট্র্যাক করুন</h2>
        <form onSubmit={trackOrder} className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
          <input className={input} placeholder="অর্ডার নম্বর (SF...)" value={trackNo} onChange={(e) => setTrackNo(e.target.value)} required />
          <input className={input} placeholder="অর্ডারের মোবাইল নম্বর" inputMode="tel" value={trackPhone} onChange={(e) => setTrackPhone(e.target.value)} required />
          <button disabled={tracking} className="rounded-xl bg-slate-900 px-6 py-3 font-bold text-white disabled:opacity-50">{tracking ? '...' : 'দেখুন'}</button>
        </form>
        {trackErr && <p className="mt-3 text-sm font-bold text-red-600">{trackErr}</p>}
        {tracked && (
          <div className="mt-5 space-y-3">
            <p className="text-sm text-slate-600">
              অর্ডার <b>{tracked.orderNumber}</b> · মোট <b>{money(tracked.total)}</b> · পেমেন্ট: {tracked.paymentMethod} ({tracked.paymentStatus === 'Paid' ? 'পরিশোধিত' : tracked.paymentStatus === 'Refunded' ? 'ফেরত' : 'অপরিশোধিত'})
            </p>
            {tracked.status === 'Cancelled' ? (
              <p className="rounded-xl bg-red-50 px-4 py-3 font-bold text-red-700">এই অর্ডারটি বাতিল করা হয়েছে</p>
            ) : (
              <ol className="grid grid-cols-5 gap-2">
                {STEPS.map((s, i) => (
                  <li key={s} className={`rounded-xl p-2 text-center text-xs font-bold ${i <= STEPS.indexOf(tracked.status) ? 'bg-green-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                    {STEP_BN[s]}
                  </li>
                ))}
              </ol>
            )}
          </div>
        )}
      </section>

      {/* কুইক ভিউ */}
      {quick && (
        <div className="fixed inset-0 z-[90] overflow-y-auto bg-black/60 p-4 backdrop-blur-sm" onClick={() => setQuickId(null)}>
          <div role="dialog" aria-modal="true" aria-label={quick.name} onClick={(e) => e.stopPropagation()} className="mx-auto mt-6 max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="grid md:grid-cols-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={quick.image} alt={quick.name} className="h-full min-h-72 w-full bg-slate-100 object-cover" />
              <div className="p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900">{quick.name}</h2>
                    <p className="text-sm text-slate-500">{quick.category}{quick.brand ? ` · ${quick.brand}` : ''}{quick.sku ? ` · ${quick.sku}` : ''}</p>
                  </div>
                  <button onClick={() => setQuickId(null)} aria-label="বন্ধ করুন" className="rounded-lg bg-slate-100 px-3 py-1.5 font-bold hover:bg-slate-200">✕</button>
                </div>
                <p className="mt-4 text-3xl font-black text-green-700">
                  {money(quick.finalPrice)}
                  {quick.discount > 0 && <span className="ml-2 text-base font-bold text-slate-400 line-through">{money(quick.price)}</span>}
                </p>
                <p className="mt-1 text-sm text-slate-600">⭐ {quick.rating.toFixed(1)} · {quick.stock > 0 ? `স্টকে ${quick.stock} টি` : 'স্টক নেই'}</p>

                {quick.colors.length > 0 && (
                  <div className="mt-4">
                    <p className="mb-2 text-sm font-bold">রং</p>
                    <div className="flex flex-wrap gap-2">
                      {quick.colors.map((c) => (
                        <button key={c} onClick={() => setQvColor(c)} className={`rounded-full border px-4 py-1.5 text-sm font-bold ${qvColor === c ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-300 hover:bg-slate-100'}`}>{c}</button>
                      ))}
                    </div>
                  </div>
                )}
                {quick.sizes.length > 0 && (
                  <div className="mt-4">
                    <p className="mb-2 text-sm font-bold">সাইজ</p>
                    <div className="flex flex-wrap gap-2">
                      {quick.sizes.map((s) => (
                        <button key={s} onClick={() => setQvSize(s)} className={`rounded-full border px-4 py-1.5 text-sm font-bold ${qvSize === s ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-300 hover:bg-slate-100'}`}>{s}</button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-5 flex items-center gap-3">
                  <span className="text-sm font-bold">পরিমাণ</span>
                  <button onClick={() => setQvQty((q) => Math.max(1, q - 1))} className="h-9 w-9 rounded-lg bg-slate-100 font-black hover:bg-slate-200" aria-label="কমান">−</button>
                  <span className="w-8 text-center font-black">{qvQty}</span>
                  <button onClick={() => setQvQty((q) => Math.min(config?.maxQtyPerLine ?? 10, quick.stock, q + 1))} className="h-9 w-9 rounded-lg bg-slate-100 font-black hover:bg-slate-200" aria-label="বাড়ান">+</button>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <button
                    disabled={quick.stock <= 0}
                    onClick={() => addToCart(quick, { color: qvColor, size: qvSize, qty: qvQty })}
                    className="rounded-xl bg-slate-900 py-3 font-bold text-white hover:bg-black disabled:opacity-40"
                  >
                    কার্টে যোগ করুন
                  </button>
                  <button
                    disabled={quick.stock <= 0}
                    onClick={() => {
                      if (addToCart(quick, { color: qvColor, size: qvSize, qty: qvQty })) {
                        setQuickId(null);
                        setShowCart(true);
                      }
                    }}
                    className="rounded-xl bg-blue-600 py-3 font-bold text-white hover:bg-blue-700 disabled:opacity-40"
                  >
                    এখনই কিনুন
                  </button>
                  <button onClick={() => toggleWish(quick.id)} className="rounded-xl bg-pink-100 py-3 font-bold text-pink-700 hover:bg-pink-200">{wishlist.includes(quick.id) ? '♥ পছন্দের' : '♡ পছন্দ'}</button>
                  <button onClick={() => toggleCompare(quick.id)} className="rounded-xl bg-amber-100 py-3 font-bold text-amber-800 hover:bg-amber-200">{compare.includes(quick.id) ? '✓ তুলনায়' : 'তুলনা'}</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* কার্ট ড্রয়ার */}
      {showCart && (
        <div className="fixed inset-0 z-[80] bg-black/50 backdrop-blur-sm" onClick={() => setShowCart(false)}>
          <aside role="dialog" aria-modal="true" aria-label="কার্ট" onClick={(e) => e.stopPropagation()} className="absolute right-0 top-0 h-full w-full max-w-xl overflow-y-auto bg-white p-5 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-2xl font-black text-slate-900">আপনার কার্ট</h2>
              <button onClick={() => setShowCart(false)} className="rounded-lg bg-slate-100 px-3 py-1.5 font-bold hover:bg-slate-200">বন্ধ করুন</button>
            </div>

            {cart.length === 0 ? (
              <div className="rounded-2xl bg-slate-50 py-14 text-center">
                <div className="mb-2 text-5xl">🛒</div>
                <p className="font-bold text-slate-600">কার্ট খালি</p>
              </div>
            ) : (
              <form onSubmit={placeOrder} className="space-y-6">
                <ul className="space-y-3">
                  {cart.map((l) => {
                    const p = byId.get(l.productId);
                    if (!p) return null;
                    return (
                      <li key={lineKey(l)} className="flex items-center gap-3 rounded-2xl border border-slate-200 p-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.image} alt="" className="h-16 w-16 rounded-xl bg-slate-100 object-cover" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-bold text-slate-900">{p.name}</p>
                          <p className="text-xs text-slate-500">{[l.color, l.size].filter(Boolean).join(' · ')}</p>
                          <p className="text-sm font-bold text-green-700">{money(p.finalPrice * l.quantity)}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <button type="button" onClick={() => changeQty(l, -1)} className="h-8 w-8 rounded-lg bg-slate-100 font-black" aria-label="কমান">−</button>
                          <span className="w-6 text-center font-bold">{l.quantity}</span>
                          <button type="button" onClick={() => changeQty(l, 1)} className="h-8 w-8 rounded-lg bg-slate-100 font-black" aria-label="বাড়ান">+</button>
                        </div>
                        <button type="button" onClick={() => removeLine(l)} className="rounded-lg bg-red-50 px-2.5 py-1.5 text-sm font-bold text-red-600 hover:bg-red-100" aria-label="সরান">✕</button>
                      </li>
                    );
                  })}
                </ul>

                <div className="grid gap-3">
                  <input className={input} placeholder="আপনার নাম *" value={name} onChange={(e) => setName(e.target.value)} required minLength={2} maxLength={120} autoComplete="name" />
                  <input className={input} placeholder="মোবাইল নম্বর * (017XXXXXXXX)" value={phone} onChange={(e) => setPhone(e.target.value)} required inputMode="tel" autoComplete="tel" />
                  <textarea className={`${input} min-h-24`} placeholder="সম্পূর্ণ ঠিকানা * (এলাকা, থানা, জেলা)" value={address} onChange={(e) => setAddress(e.target.value)} required minLength={10} maxLength={500} autoComplete="street-address" />

                  <select className={input} value={shippingKey} onChange={(e) => setShippingKey(e.target.value)} aria-label="ডেলিভারি এলাকা">
                    {config?.shipping.map((s) => (
                      <option key={s.key} value={s.key}>{s.label} - {money(s.charge)}</option>
                    ))}
                  </select>

                  <select className={input} value={payMethod} onChange={(e) => setPayMethod(e.target.value)} aria-label="পেমেন্ট পদ্ধতি">
                    {config?.payments.map((p) => (
                      <option key={p.method} value={p.method}>{p.method === 'COD' ? 'ক্যাশ অন ডেলিভারি' : p.method}</option>
                    ))}
                  </select>

                  {payOption?.needsTrxId && (
                    <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
                      <p>
                        আপনার <b>{payOption.method}</b> থেকে <b>{payOption.number}</b> নম্বরে{' '}
                        <b>{quote ? money(quote.total) : 'মোট টাকা'}</b> Send Money করুন, তারপর নিচে ট্রানজেকশন আইডি দিন।
                      </p>
                      <input className={`${input} mt-3`} placeholder="ট্রানজেকশন আইডি (TrxID) *" value={trxId} onChange={(e) => setTrxId(e.target.value)} required maxLength={20} autoComplete="off" />
                    </div>
                  )}

                  {config?.couponsEnabled && (
                    <div className="flex gap-2">
                      <input className={input} placeholder="কুপন কোড" value={couponInput} onChange={(e) => setCouponInput(e.target.value)} />
                      <button type="button" onClick={applyCoupon} className="whitespace-nowrap rounded-xl bg-blue-600 px-5 font-bold text-white hover:bg-blue-700">প্রয়োগ</button>
                    </div>
                  )}
                </div>

                <div className="space-y-2 rounded-2xl bg-slate-50 p-5 text-sm">
                  {quote ? (
                    <>
                      <Row k="সাবটোটাল" v={money(quote.subtotal)} />
                      {quote.productSavings > 0 && <Row k="প্রোডাক্ট ছাড়ে সাশ্রয়" v={`− ${money(quote.productSavings)}`} />}
                      {quote.couponDiscount > 0 && <Row k={`কুপন (${quote.couponCode})`} v={`− ${money(quote.couponDiscount)}`} />}
                      <Row k={`ভ্যাট (${config?.vatPercent ?? 0}%)`} v={money(quote.vat)} />
                      <Row k="ডেলিভারি চার্জ" v={money(quote.shipping)} />
                      <div className="flex justify-between border-t pt-3 text-xl font-black text-slate-900">
                        <span>সর্বমোট</span>
                        <span>{money(quote.total)}</span>
                      </div>
                    </>
                  ) : quoteErr ? (
                    <p className="font-bold text-red-600">{quoteErr}</p>
                  ) : (
                    <p className="text-slate-500">{quoting ? 'হিসাব হচ্ছে...' : ' '}</p>
                  )}
                </div>

                {checkoutErr && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{checkoutErr}</p>}

                <button disabled={placing || quoting || !quote} className="w-full rounded-2xl bg-green-600 py-4 text-lg font-black text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50">
                  {placing ? 'অর্ডার হচ্ছে...' : 'অর্ডার কনফার্ম করুন'}
                </button>
              </form>
            )}
          </aside>
        </div>
      )}

      {/* উইশলিস্ট */}
      {showWishlist && (
        <div className="fixed inset-0 z-[75] bg-black/50 backdrop-blur-sm" onClick={() => setShowWishlist(false)}>
          <aside role="dialog" aria-modal="true" aria-label="পছন্দের তালিকা" onClick={(e) => e.stopPropagation()} className="absolute left-0 top-0 h-full w-full max-w-md overflow-y-auto bg-white p-5 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-2xl font-black">পছন্দের তালিকা</h2>
              <button onClick={() => setShowWishlist(false)} className="rounded-lg bg-slate-100 px-3 py-1.5 font-bold">বন্ধ করুন</button>
            </div>
            {wishlist.length === 0 ? (
              <p className="rounded-2xl bg-slate-50 py-14 text-center font-bold text-slate-500">কিছু যোগ করা হয়নি</p>
            ) : (
              <ul className="space-y-3">
                {wishlist.map((id) => {
                  const p = byId.get(id);
                  if (!p) return null;
                  return (
                    <li key={id} className="flex items-center gap-3 rounded-2xl border border-slate-200 p-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.image} alt="" className="h-16 w-16 rounded-xl bg-slate-100 object-cover" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-bold">{p.name}</p>
                        <p className="text-sm font-bold text-green-700">{money(p.finalPrice)}</p>
                      </div>
                      <div className="grid gap-1">
                        <button onClick={() => { setShowWishlist(false); openQuick(p); }} className="rounded-lg bg-green-600 px-3 py-1.5 text-sm font-bold text-white">কিনুন</button>
                        <button onClick={() => toggleWish(id)} className="rounded-lg bg-red-50 px-3 py-1.5 text-sm font-bold text-red-600">সরান</button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </aside>
        </div>
      )}

      {/* তুলনা */}
      {showCompare && (
        <div className="fixed inset-0 z-[70] overflow-y-auto bg-black/60 p-4 backdrop-blur-sm" onClick={() => setShowCompare(false)}>
          <div role="dialog" aria-modal="true" aria-label="প্রোডাক্ট তুলনা" onClick={(e) => e.stopPropagation()} className="mx-auto mt-8 max-w-5xl rounded-3xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-2xl font-black">প্রোডাক্ট তুলনা</h2>
              <button onClick={() => setShowCompare(false)} className="rounded-lg bg-slate-100 px-3 py-1.5 font-bold">বন্ধ করুন</button>
            </div>
            {compare.length === 0 ? (
              <p className="rounded-2xl bg-slate-50 py-14 text-center font-bold text-slate-500">তুলনার জন্য প্রোডাক্ট বেছে নিন (সর্বোচ্চ ৩টি)</p>
            ) : (
              <div className="grid gap-4 md:grid-cols-3">
                {compare.map((id) => {
                  const p = byId.get(id);
                  if (!p) return null;
                  return (
                    <div key={id} className="rounded-2xl border border-slate-200 p-4">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.image} alt={p.name} className="mb-3 h-40 w-full rounded-xl bg-slate-100 object-cover" />
                      <h3 className="font-black">{p.name}</h3>
                      <dl className="mt-3 space-y-1 text-sm">
                        <div className="flex justify-between"><dt className="text-slate-500">দাম</dt><dd className="font-bold">{money(p.finalPrice)}</dd></div>
                        <div className="flex justify-between"><dt className="text-slate-500">রেটিং</dt><dd className="font-bold">⭐ {p.rating.toFixed(1)}</dd></div>
                        <div className="flex justify-between"><dt className="text-slate-500">স্টক</dt><dd className="font-bold">{p.stock}</dd></div>
                        <div className="flex justify-between gap-3"><dt className="text-slate-500">রং</dt><dd className="text-right font-bold">{p.colors.join(', ') || '-'}</dd></div>
                        <div className="flex justify-between gap-3"><dt className="text-slate-500">সাইজ</dt><dd className="text-right font-bold">{p.sizes.join(', ') || '-'}</dd></div>
                      </dl>
                      <div className="mt-4 grid grid-cols-2 gap-2">
                        <button onClick={() => { setShowCompare(false); openQuick(p); }} className="rounded-lg bg-green-600 py-2 text-sm font-bold text-white">কিনুন</button>
                        <button onClick={() => toggleCompare(id)} className="rounded-lg bg-red-50 py-2 text-sm font-bold text-red-600">সরান</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* অর্ডার সফল */}
      {placed && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div role="dialog" aria-modal="true" aria-label="অর্ডার সম্পন্ন" className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-2xl">
            <div className="mb-3 text-6xl">✅</div>
            <h2 className="text-2xl font-black text-slate-900">অর্ডার সম্পন্ন হয়েছে</h2>
            <p className="mt-3 text-slate-600">আপনার অর্ডার নম্বর</p>
            <p className="my-2 select-all rounded-xl bg-slate-100 py-3 font-mono text-xl font-black tracking-wider">{placed.orderNumber}</p>
            <p className="text-sm text-slate-600">এই নম্বর ও আপনার মোবাইল নম্বর দিয়ে নিচে অর্ডার ট্র্যাক করতে পারবেন। নম্বরটি সংরক্ষণ করুন।</p>
            <p className="mt-3 text-sm font-bold text-slate-800">
              সর্বমোট {money(placed.total)} · {placed.paymentMethod === 'COD' ? 'ডেলিভারির সময় টাকা দেবেন' : 'পেমেন্ট যাচাইয়ের পর অর্ডার প্রসেস হবে'}
            </p>
            <button
              onClick={() => {
                setTrackNo(placed.orderNumber);
                setTrackPhone(phone);
                setPlaced(null);
              }}
              className="mt-6 w-full rounded-xl bg-slate-900 py-3 font-bold text-white"
            >
              ঠিক আছে
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-slate-600">{k}</span>
      <b>{v}</b>
    </div>
  );
}
