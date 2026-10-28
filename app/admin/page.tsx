'use client';

// app/admin/page.tsx
// স্টোর অ্যাডমিন: প্রোডাক্টের দাম/ডিসকাউন্ট/স্টক/ছবি বদলানো, নতুন প্রোডাক্ট, অর্ডার ও পেমেন্ট স্ট্যাটাস ম্যানেজ।

import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';

type AdminProduct = {
  id: string;
  name: string;
  slug: string;
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
  active: boolean;
};

type AdminOrder = {
  id: string;
  orderNumber: string;
  customer: { name: string; phone: string; address: string };
  items: { name: string; sku: string; quantity: number; unitPrice: number; color: string; size: string }[];
  paymentMethod: string;
  paymentTrxId: string;
  paymentStatus: string;
  couponCode: string;
  subtotal: number;
  vat: number;
  shipping: number;
  discount: number;
  total: number;
  status: string;
  createdAt: string | null;
};

const ORDER_STATUSES = ['Pending', 'Processing', 'Packaging', 'Shipped', 'Delivered', 'Cancelled'];
const PAYMENT_STATUSES = ['Unpaid', 'Paid', 'Refunded'];

const money = (n: number) => `৳ ${Number(n || 0).toLocaleString('en-BD', { maximumFractionDigits: 2 })}`;

const field =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-300';
const btn = 'rounded-lg px-4 py-2 text-sm font-bold transition disabled:opacity-50';

type ApiResult<T> = { success: boolean; error?: string } & T;

async function api<T>(path: string, init?: RequestInit): Promise<ApiResult<T>> {
  const res = await fetch(path, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
    cache: 'no-store',
  });
  let data: unknown = {};
  try {
    data = await res.json();
  } catch {
    /* খালি বডি */
  }
  const out = data as ApiResult<T>;
  if (!res.ok && out.success !== false) return { success: false, error: `Error ${res.status}` } as ApiResult<T>;
  if (res.status === 401) window.dispatchEvent(new Event('sf-admin-401'));
  return out;
}

// ------------------------------------------------------------------ প্রোডাক্ট ফর্ম (নতুন ও এডিট দুটোতেই)

type FormState = {
  name: string;
  image: string;
  category: string;
  brand: string;
  sku: string;
  slug: string;
  price: string;
  discount: string;
  stock: string;
  rating: string;
  colors: string;
  sizes: string;
  tags: string;
  featured: boolean;
  flashSale: boolean;
  active: boolean;
};

const emptyForm: FormState = {
  name: '', image: '', category: '', brand: '', sku: '', slug: '',
  price: '', discount: '0', stock: '0', rating: '0',
  colors: '', sizes: '', tags: '', featured: false, flashSale: false, active: true,
};

const fromProduct = (p: AdminProduct): FormState => ({
  name: p.name, image: p.image, category: p.category, brand: p.brand, sku: p.sku, slug: p.slug,
  price: String(p.price), discount: String(p.discount), stock: String(p.stock), rating: String(p.rating),
  colors: p.colors.join(', '), sizes: p.sizes.join(', '), tags: p.tags.join(', '),
  featured: p.featured, flashSale: p.flashSale, active: p.active,
});

function ProductForm(props: {
  initial: FormState;
  submitLabel: string;
  onSubmit: (f: FormState) => Promise<string | null>;
  onCancel?: () => void;
}) {
  const [f, setF] = useState<FormState>(props.initial);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setF((s) => ({ ...s, [k]: v }));

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr('');
    const problem = await props.onSubmit(f);
    setBusy(false);
    if (problem) setErr(problem);
  }

  const label = 'mb-1 block text-xs font-bold text-slate-600';

  return (
    <form onSubmit={submit} className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className={label}>প্রোডাক্টের নাম *</label>
          <input className={field} value={f.name} onChange={(e) => set('name', e.target.value)} required maxLength={200} />
        </div>
        <div className="md:col-span-2">
          <label className={label}>ছবির লিংক (https://...) *</label>
          <input className={field} value={f.image} onChange={(e) => set('image', e.target.value)} required />
        </div>
        <div>
          <label className={label}>মূল দাম (৳) *</label>
          <input className={field} type="number" min="0" step="0.01" value={f.price} onChange={(e) => set('price', e.target.value)} required />
        </div>
        <div>
          <label className={label}>ডিসকাউন্ট (%)</label>
          <input className={field} type="number" min="0" max="90" step="0.01" value={f.discount} onChange={(e) => set('discount', e.target.value)} />
        </div>
        <div>
          <label className={label}>স্টক (পিস)</label>
          <input className={field} type="number" min="0" step="1" value={f.stock} onChange={(e) => set('stock', e.target.value)} />
        </div>
        <div>
          <label className={label}>ক্যাটেগরি *</label>
          <input className={field} value={f.category} onChange={(e) => set('category', e.target.value)} required maxLength={60} />
        </div>
        <div>
          <label className={label}>ব্র্যান্ড</label>
          <input className={field} value={f.brand} onChange={(e) => set('brand', e.target.value)} maxLength={60} />
        </div>
        <div>
          <label className={label}>SKU</label>
          <input className={field} value={f.sku} onChange={(e) => set('sku', e.target.value)} maxLength={60} />
        </div>
        <div>
          <label className={label}>রং (কমা দিয়ে)</label>
          <input className={field} value={f.colors} onChange={(e) => set('colors', e.target.value)} placeholder="Black, White, Blue" />
        </div>
        <div>
          <label className={label}>সাইজ (কমা দিয়ে)</label>
          <input className={field} value={f.sizes} onChange={(e) => set('sizes', e.target.value)} placeholder="M, L, XL" />
        </div>
        <div>
          <label className={label}>ট্যাগ (কমা দিয়ে)</label>
          <input className={field} value={f.tags} onChange={(e) => set('tags', e.target.value)} />
        </div>
        <div>
          <label className={label}>রেটিং (০–৫)</label>
          <input className={field} type="number" min="0" max="5" step="0.1" value={f.rating} onChange={(e) => set('rating', e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <label className={label}>URL slug (ইংরেজিতে, খালি রাখলে নাম থেকে বানাবে)</label>
          <input className={field} value={f.slug} onChange={(e) => set('slug', e.target.value)} />
        </div>
      </div>

      <div className="flex flex-wrap gap-5 text-sm font-bold text-slate-700">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={f.active} onChange={(e) => set('active', e.target.checked)} /> দোকানে দেখাও
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={f.featured} onChange={(e) => set('featured', e.target.checked)} /> Featured
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={f.flashSale} onChange={(e) => set('flashSale', e.target.checked)} /> Flash Sale
        </label>
      </div>

      {err && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-bold text-red-700">{err}</p>}

      <div className="flex gap-3">
        <button disabled={busy} className={`${btn} bg-blue-600 text-white hover:bg-blue-700`}>
          {busy ? 'সেভ হচ্ছে...' : props.submitLabel}
        </button>
        {props.onCancel && (
          <button type="button" onClick={props.onCancel} className={`${btn} border border-slate-300 bg-white hover:bg-slate-100`}>
            বাতিল
          </button>
        )}
      </div>
    </form>
  );
}

const payloadFrom = (f: FormState, forCreate: boolean) => {
  const p: Record<string, unknown> = {
    name: f.name,
    image: f.image,
    category: f.category,
    brand: f.brand,
    sku: f.sku,
    price: f.price,
    discount: f.discount === '' ? 0 : f.discount,
    stock: f.stock === '' ? 0 : f.stock,
    rating: f.rating === '' ? 0 : f.rating,
    colors: f.colors,
    sizes: f.sizes,
    tags: f.tags,
    featured: f.featured,
    flashSale: f.flashSale,
    active: f.active,
  };
  if (f.slug.trim() || !forCreate) p.slug = f.slug.trim();
  return p;
};

// ------------------------------------------------------------------ প্রোডাক্ট সারি (দ্রুত দাম/স্টক এডিট)

function ProductRow(props: {
  p: AdminProduct;
  onChanged: (p: AdminProduct) => void;
  onDeleted: (id: string) => void;
  notify: (m: string) => void;
}) {
  const { p } = props;
  const [price, setPrice] = useState(String(p.price));
  const [discount, setDiscount] = useState(String(p.discount));
  const [stock, setStock] = useState(String(p.stock));
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState(false);

  // সার্ভার থেকে নতুন মান এলে ইনপুট সিঙ্ক
  useEffect(() => {
    setPrice(String(p.price));
    setDiscount(String(p.discount));
    setStock(String(p.stock));
  }, [p.price, p.discount, p.stock]);

  const dirty = price !== String(p.price) || discount !== String(p.discount) || stock !== String(p.stock);

  async function quickSave() {
    setBusy(true);
    const r = await api<{ product: AdminProduct }>(`/api/admin/products/${p.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ price, discount: discount === '' ? 0 : discount, stock: stock === '' ? 0 : stock }),
    });
    setBusy(false);
    if (r.success) {
      props.onChanged(r.product);
      props.notify('সেভ হয়েছে');
    } else props.notify(r.error ?? 'সেভ হয়নি');
  }

  async function toggleActive() {
    const r = await api<{ product: AdminProduct }>(`/api/admin/products/${p.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ active: !p.active }),
    });
    if (r.success) props.onChanged(r.product);
    else props.notify(r.error ?? 'আপডেট হয়নি');
  }

  async function remove() {
    if (!confirm(`"${p.name}" মুছে ফেলবেন? এটা ফেরানো যাবে না। (শুধু লুকাতে চাইলে "দোকানে দেখাও" বন্ধ করুন)`)) return;
    const r = await api<object>(`/api/admin/products/${p.id}`, { method: 'DELETE' });
    if (r.success) props.onDeleted(p.id);
    else props.notify(r.error ?? 'মোছা যায়নি');
  }

  return (
    <div className={`rounded-2xl border bg-white p-4 shadow-sm ${p.active ? 'border-slate-200' : 'border-amber-300 bg-amber-50/40'}`}>
      <div className="flex flex-wrap items-center gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={p.image} alt="" className="h-16 w-16 rounded-xl bg-slate-100 object-cover" />
        <div className="min-w-[180px] flex-1">
          <p className="font-bold text-slate-900">{p.name}</p>
          <p className="text-xs text-slate-500">
            {p.category}
            {p.sku ? ` · ${p.sku}` : ''} · বিক্রি {p.sold}
            {!p.active && <b className="ml-2 text-amber-700">লুকানো</b>}
          </p>
          <p className="text-xs font-bold text-green-700">
            গ্রাহক দেখবে: {money(p.finalPrice)}
            {p.discount > 0 && <span className="ml-1 text-slate-400 line-through">{money(p.price)}</span>}
          </p>
        </div>

        <label className="w-28 text-xs font-bold text-slate-600">
          দাম ৳
          <input className={field} type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} />
        </label>
        <label className="w-24 text-xs font-bold text-slate-600">
          ছাড় %
          <input className={field} type="number" min="0" max="90" step="0.01" value={discount} onChange={(e) => setDiscount(e.target.value)} />
        </label>
        <label className="w-24 text-xs font-bold text-slate-600">
          স্টক
          <input className={`${field} ${p.stock <= 5 ? 'border-red-400' : ''}`} type="number" min="0" step="1" value={stock} onChange={(e) => setStock(e.target.value)} />
        </label>

        <div className="flex flex-wrap gap-2">
          <button onClick={quickSave} disabled={!dirty || busy} className={`${btn} bg-green-600 text-white hover:bg-green-700`}>
            {busy ? '...' : 'সেভ'}
          </button>
          <button onClick={() => setEditing((v) => !v)} className={`${btn} border border-slate-300 hover:bg-slate-100`}>
            বিস্তারিত
          </button>
          <button onClick={toggleActive} className={`${btn} border border-slate-300 hover:bg-slate-100`}>
            {p.active ? 'লুকাও' : 'দেখাও'}
          </button>
          <button onClick={remove} className={`${btn} bg-red-50 text-red-700 hover:bg-red-100`}>
            মুছুন
          </button>
        </div>
      </div>

      {editing && (
        <div className="mt-4">
          <ProductForm
            initial={fromProduct(p)}
            submitLabel="পরিবর্তন সেভ করুন"
            onCancel={() => setEditing(false)}
            onSubmit={async (f) => {
              const r = await api<{ product: AdminProduct }>(`/api/admin/products/${p.id}`, {
                method: 'PATCH',
                body: JSON.stringify(payloadFrom(f, false)),
              });
              if (!r.success) return r.error ?? 'সেভ হয়নি';
              props.onChanged(r.product);
              props.notify('সেভ হয়েছে');
              setEditing(false);
              return null;
            }}
          />
        </div>
      )}
    </div>
  );
}

// ------------------------------------------------------------------ অর্ডার কার্ড

function OrderCard(props: { o: AdminOrder; onChanged: (id: string, patch: Partial<AdminOrder>) => void; notify: (m: string) => void }) {
  const { o } = props;
  const [busy, setBusy] = useState(false);
  const locked = o.status === 'Cancelled';

  async function patch(body: { status?: string; paymentStatus?: string }) {
    if (body.status === 'Cancelled' && !confirm(`অর্ডার ${o.orderNumber} বাতিল করবেন? স্টক ফেরত যাবে।`)) return;
    setBusy(true);
    const r = await api<{ status: string; paymentStatus: string }>(`/api/admin/orders/${o.id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
    setBusy(false);
    if (r.success) {
      props.onChanged(o.id, { status: r.status, paymentStatus: r.paymentStatus });
      props.notify('আপডেট হয়েছে');
    } else props.notify(r.error ?? 'আপডেট হয়নি');
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-black text-slate-900">{o.orderNumber}</p>
          <p className="text-xs text-slate-500">{o.createdAt ? new Date(o.createdAt).toLocaleString('bn-BD') : ''}</p>
        </div>
        <p className="text-xl font-black text-green-700">{money(o.total)}</p>
      </div>

      <div className="mt-3 grid gap-4 md:grid-cols-2">
        <div className="text-sm">
          <p className="font-bold">{o.customer.name}</p>
          <p>
            <a className="text-blue-600 underline" href={`tel:${o.customer.phone}`}>{o.customer.phone}</a>
          </p>
          <p className="text-slate-600">{o.customer.address}</p>
        </div>
        <ul className="space-y-1 text-sm">
          {o.items.map((i, idx) => (
            <li key={idx} className="flex justify-between gap-3">
              <span>
                {i.name} × {i.quantity}
                <span className="text-slate-500">{[i.color, i.size].filter(Boolean).length ? ` (${[i.color, i.size].filter(Boolean).join(', ')})` : ''}</span>
              </span>
              <b>{money(i.unitPrice * i.quantity)}</b>
            </li>
          ))}
          <li className="border-t pt-1 text-xs text-slate-500">
            সাবটোটাল {money(o.subtotal)} · ভ্যাট {money(o.vat)} · ডেলিভারি {money(o.shipping)}
            {o.discount > 0 ? ` · কুপন ${o.couponCode} −${money(o.discount)}` : ''}
          </li>
        </ul>
      </div>

      <div className="mt-4 flex flex-wrap items-end gap-4 border-t pt-4">
        <div className="text-sm">
          <p className="text-xs font-bold text-slate-500">পেমেন্ট</p>
          <p className="font-bold">
            {o.paymentMethod}
            {o.paymentTrxId && <span className="ml-2 rounded bg-slate-100 px-2 py-0.5 font-mono text-xs">TrxID: {o.paymentTrxId}</span>}
          </p>
        </div>
        <label className="text-xs font-bold text-slate-600">
          পেমেন্ট স্ট্যাটাস
          <select className={field} disabled={busy} value={o.paymentStatus} onChange={(e) => patch({ paymentStatus: e.target.value })}>
            {PAYMENT_STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </label>
        <label className="text-xs font-bold text-slate-600">
          অর্ডার স্ট্যাটাস
          <select className={field} disabled={busy || locked} value={o.status} onChange={(e) => patch({ status: e.target.value })}>
            {ORDER_STATUSES.map((s) => (
              <option key={s} disabled={s === 'Cancelled' && o.status === 'Delivered'}>{s}</option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------ মূল পেজ

export default function AdminPage() {
  const [auth, setAuth] = useState<'loading' | 'login' | 'ready' | 'unconfigured'>('loading');
  const [password, setPassword] = useState('');
  const [loginErr, setLoginErr] = useState('');
  const [tab, setTab] = useState<'products' | 'orders'>('products');
  const [toast, setToast] = useState('');

  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loadingP, setLoadingP] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [search, setSearch] = useState('');

  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [orderTotal, setOrderTotal] = useState(0);
  const [loadingO, setLoadingO] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [orderQuery, setOrderQuery] = useState('');

  const notify = useCallback((m: string) => {
    setToast(m);
    window.setTimeout(() => setToast(''), 3000);
  }, []);

  useEffect(() => {
    api<{ configured: boolean; authenticated: boolean }>('/api/admin/login').then((r) => {
      if (!r.configured) setAuth('unconfigured');
      else setAuth(r.authenticated ? 'ready' : 'login');
    });
    const on401 = () => setAuth('login');
    window.addEventListener('sf-admin-401', on401);
    return () => window.removeEventListener('sf-admin-401', on401);
  }, []);

  const loadProducts = useCallback(async () => {
    setLoadingP(true);
    const r = await api<{ products: AdminProduct[] }>('/api/admin/products');
    setLoadingP(false);
    if (r.success) setProducts(r.products);
    else notify(r.error ?? 'প্রোডাক্ট লোড হয়নি');
  }, [notify]);

  const loadOrders = useCallback(async () => {
    setLoadingO(true);
    const qs = new URLSearchParams();
    if (statusFilter) qs.set('status', statusFilter);
    if (orderQuery.trim()) qs.set('q', orderQuery.trim());
    const r = await api<{ orders: AdminOrder[]; total: number }>(`/api/admin/orders?${qs.toString()}`);
    setLoadingO(false);
    if (r.success) {
      setOrders(r.orders);
      setOrderTotal(r.total);
    } else notify(r.error ?? 'অর্ডার লোড হয়নি');
  }, [statusFilter, orderQuery, notify]);

  useEffect(() => {
    if (auth === 'ready') loadProducts();
  }, [auth, loadProducts]);

  useEffect(() => {
    if (auth === 'ready' && tab === 'orders') loadOrders();
  }, [auth, tab, loadOrders]);

  async function login(e: FormEvent) {
    e.preventDefault();
    setLoginErr('');
    const r = await api<object>('/api/admin/login', { method: 'POST', body: JSON.stringify({ password }) });
    if (r.success) {
      setPassword('');
      setAuth('ready');
    } else setLoginErr(r.error ?? 'লগইন হয়নি');
  }

  async function logout() {
    await api<object>('/api/admin/login', { method: 'DELETE' });
    setProducts([]);
    setOrders([]);
    setAuth('login');
  }

  const shown = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) => [p.name, p.sku, p.category, p.brand].join(' ').toLowerCase().includes(q));
  }, [products, search]);

  const lowStock = products.filter((p) => p.active && p.stock <= 5).length;

  if (auth === 'loading') return <p className="py-24 text-center font-bold text-slate-500">লোড হচ্ছে...</p>;

  if (auth === 'unconfigured') {
    return (
      <div className="mx-auto max-w-xl py-16">
        <div className="rounded-2xl border border-amber-300 bg-amber-50 p-6 text-sm text-amber-900">
          <h1 className="mb-2 text-xl font-black">অ্যাডমিন সেটআপ বাকি</h1>
          <p>Vercel → Project → Settings → Environment Variables-এ এই দুটো যোগ করে Redeploy করুন:</p>
          <ul className="mt-3 list-disc space-y-1 pl-5">
            <li><code>ADMIN_PASSWORD</code>: কমপক্ষে ১০ অক্ষরের শক্ত পাসওয়ার্ড</li>
            <li><code>ADMIN_SESSION_SECRET</code>: কমপক্ষে ৩২ অক্ষরের এলোমেলো স্ট্রিং</li>
          </ul>
        </div>
      </div>
    );
  }

  if (auth === 'login') {
    return (
      <div className="mx-auto max-w-sm py-20">
        <form onSubmit={login} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow">
          <h1 className="text-2xl font-black text-slate-900">স্টোর অ্যাডমিন</h1>
          <input
            type="password"
            autoFocus
            autoComplete="current-password"
            className={field}
            placeholder="অ্যাডমিন পাসওয়ার্ড"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {loginErr && <p className="text-sm font-bold text-red-600">{loginErr}</p>}
          <button className={`${btn} w-full bg-blue-600 py-3 text-white hover:bg-blue-700`}>লগইন</button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-6">
      {toast && (
        <div role="status" className="fixed right-5 top-5 z-50 rounded-xl bg-black px-5 py-3 text-sm font-bold text-white shadow-2xl">
          {toast}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black text-slate-900">স্টোর অ্যাডমিন</h1>
          <p className="text-sm text-slate-500">
            {products.length} টি প্রোডাক্ট{lowStock > 0 && <b className="ml-2 text-red-600">{lowStock} টির স্টক কম</b>}
          </p>
        </div>
        <button onClick={logout} className={`${btn} border border-slate-300 bg-white hover:bg-slate-100`}>লগআউট</button>
      </div>

      <div className="flex gap-2">
        {(['products', 'orders'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`${btn} ${tab === t ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
          >
            {t === 'products' ? 'প্রোডাক্ট' : 'অর্ডার'}
          </button>
        ))}
      </div>

      {tab === 'products' && (
        <section className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <input className={`${field} max-w-sm`} placeholder="নাম, SKU, ক্যাটেগরি দিয়ে খুঁজুন" value={search} onChange={(e) => setSearch(e.target.value)} />
            <button onClick={() => setShowNew((v) => !v)} className={`${btn} bg-blue-600 text-white hover:bg-blue-700`}>
              {showNew ? 'বন্ধ করুন' : '+ নতুন প্রোডাক্ট'}
            </button>
            <button onClick={loadProducts} className={`${btn} border border-slate-300 bg-white hover:bg-slate-100`}>রিফ্রেশ</button>
          </div>

          {showNew && (
            <ProductForm
              initial={emptyForm}
              submitLabel="প্রোডাক্ট যোগ করুন"
              onCancel={() => setShowNew(false)}
              onSubmit={async (f) => {
                const r = await api<{ product: AdminProduct }>('/api/admin/products', {
                  method: 'POST',
                  body: JSON.stringify(payloadFrom(f, true)),
                });
                if (!r.success) return r.error ?? 'সেভ হয়নি';
                setProducts((list) => [r.product, ...list]);
                setShowNew(false);
                notify('প্রোডাক্ট যোগ হয়েছে');
                return null;
              }}
            />
          )}

          {loadingP && products.length === 0 ? (
            <p className="py-10 text-center font-bold text-slate-500">লোড হচ্ছে...</p>
          ) : shown.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-slate-300 py-12 text-center text-slate-500">
              {products.length === 0 ? 'এখনো কোনো প্রোডাক্ট নেই। "+ নতুন প্রোডাক্ট" দিয়ে শুরু করুন।' : 'কিছু পাওয়া যায়নি'}
            </p>
          ) : (
            <div className="space-y-3">
              {shown.map((p) => (
                <ProductRow
                  key={p.id}
                  p={p}
                  notify={notify}
                  onChanged={(np) => setProducts((list) => list.map((x) => (x.id === np.id ? np : x)))}
                  onDeleted={(id) => {
                    setProducts((list) => list.filter((x) => x.id !== id));
                    notify('মুছে ফেলা হয়েছে');
                  }}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {tab === 'orders' && (
        <section className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <select className={`${field} max-w-[180px]`} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">সব স্ট্যাটাস</option>
              {ORDER_STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
            <input
              className={`${field} max-w-xs`}
              placeholder="অর্ডার নম্বর বা ফোনের শেষ অংশ"
              value={orderQuery}
              onChange={(e) => setOrderQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && loadOrders()}
            />
            <button onClick={loadOrders} className={`${btn} border border-slate-300 bg-white hover:bg-slate-100`}>খুঁজুন / রিফ্রেশ</button>
            <span className="self-center text-sm text-slate-500">মোট {orderTotal} টি</span>
          </div>

          {loadingO && orders.length === 0 ? (
            <p className="py-10 text-center font-bold text-slate-500">লোড হচ্ছে...</p>
          ) : orders.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-slate-300 py-12 text-center text-slate-500">কোনো অর্ডার নেই</p>
          ) : (
            <div className="space-y-3">
              {orders.map((o) => (
                <OrderCard
                  key={o.id}
                  o={o}
                  notify={notify}
                  onChanged={(id, patch) => setOrders((list) => list.map((x) => (x.id === id ? { ...x, ...patch } : x)))}
                />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
