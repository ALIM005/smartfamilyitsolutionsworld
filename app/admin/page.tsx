'use client';


// app/admin/page.tsx
// Unified store and IT solutions admin
//  - Products: change price/discount/stock/image, new products, hide/delete
//  - IT software: new software posts, edit, feature and tech stack management
//  - Orders: orders from the real API, status and payment status, summary, BDT/USD
//  - Blog: BlogManager


import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import BlogManager from '@/components/admin/BlogManager';


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


// IT software type
type ITSoftware = {
  id: string;
  title: string;
  slug: string;
  version: string;
  description: string;
  price: number;
  image: string;
  features: string[];
  techStack: string[];
  active: boolean;
  createdAt?: string;
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


type Tab = 'products' | 'it-software' | 'orders' | 'blog';
type AuthState = 'loading' | 'login' | 'ready' | 'unconfigured';
type Currency = 'BDT' | 'USD';


const ORDER_STATUSES = ['Pending', 'Processing', 'Packaging', 'Shipped', 'Delivered', 'Cancelled'];
const PAYMENT_STATUSES = ['Unpaid', 'Paid', 'Refunded'];
const USD_EXCHANGE_RATE = 120;


const formatMoney = (n: number, currency: Currency = 'BDT') => {
  const v = Number(n || 0);
  if (currency === 'USD') return `$${(v / USD_EXCHANGE_RATE).toFixed(2)}`;
  return `৳ ${v.toLocaleString('en-BD', { maximumFractionDigits: 2 })}`;
};


const field =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-300';
const btn = 'rounded-lg px-4 py-2 text-sm font-bold transition disabled:opacity-50';


type ApiResult<T> = { success: boolean; error?: string } & T;


async function api<T>(path: string, init?: RequestInit): Promise<ApiResult<T>> {
  let res: Response;
  try {
    res = await fetch(path, {
      ...init,
      headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
      cache: 'no-store',
    });
  } catch {
    return { success: false, error: 'Could not communicate with the server' } as ApiResult<T>;
  }


  if (res.status === 401 && !path.endsWith('/api/admin/login')) {
    window.dispatchEvent(new Event('sf-admin-401'));
  }


  let data: unknown = {};
  try {
    data = await res.json();
  } catch {}
  const out = data as ApiResult<T>;
  if (!res.ok && out.success !== false) return { success: false, error: `Error ${res.status}` } as ApiResult<T>;
  return out;
}


// ------------------------------------------------------------------ Product form
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
          <label className={label}>Product name *</label>
          <input className={field} value={f.name} onChange={(e) => set('name', e.target.value)} required maxLength={200} />
        </div>
        <div className="md:col-span-2">
          <label className={label}>Image link (https://...) *</label>
          <input className={field} value={f.image} onChange={(e) => set('image', e.target.value)} required />
        </div>
        <div>
          <label className={label}>Original price (৳) *</label>
          <input className={field} type="number" min="0" step="0.01" value={f.price} onChange={(e) => set('price', e.target.value)} required />
        </div>
        <div>
          <label className={label}>Discount (%)</label>
          <input className={field} type="number" min="0" max="90" step="0.01" value={f.discount} onChange={(e) => set('discount', e.target.value)} />
        </div>
        <div>
          <label className={label}>Stock (pieces)</label>
          <input className={field} type="number" min="0" step="1" value={f.stock} onChange={(e) => set('stock', e.target.value)} />
        </div>
        <div>
          <label className={label}>Category *</label>
          <input className={field} value={f.category} onChange={(e) => set('category', e.target.value)} required maxLength={60} />
        </div>
        <div>
          <label className={label}>Brand</label>
          <input className={field} value={f.brand} onChange={(e) => set('brand', e.target.value)} maxLength={60} />
        </div>
        <div>
          <label className={label}>SKU</label>
          <input className={field} value={f.sku} onChange={(e) => set('sku', e.target.value)} maxLength={60} />
        </div>
        <div>
          <label className={label}>Colors (separated by commas)</label>
          <input className={field} value={f.colors} onChange={(e) => set('colors', e.target.value)} placeholder="Black, White, Blue" />
        </div>
        <div>
          <label className={label}>Sizes (separated by commas)</label>
          <input className={field} value={f.sizes} onChange={(e) => set('sizes', e.target.value)} placeholder="M, L, XL" />
        </div>
        <div>
          <label className={label}>Tags (separated by commas)</label>
          <input className={field} value={f.tags} onChange={(e) => set('tags', e.target.value)} />
        </div>
        <div>
          <label className={label}>Rating (0–5)</label>
          <input className={field} type="number" min="0" max="5" step="0.1" value={f.rating} onChange={(e) => set('rating', e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <label className={label}>URL slug</label>
          <input className={field} value={f.slug} onChange={(e) => set('slug', e.target.value)} />
        </div>
      </div>


      <div className="flex flex-wrap gap-5 text-sm font-bold text-slate-700">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={f.active} onChange={(e) => set('active', e.target.checked)} /> Show in store
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
          {busy ? 'Saving...' : props.submitLabel}
        </button>
        {props.onCancel && (
          <button type="button" onClick={props.onCancel} className={`${btn} border border-slate-300 bg-white hover:bg-slate-100`}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}


const payloadFrom = (f: FormState, forCreate: boolean) => {
  const p: Record<string, unknown> = {
    name: f.name, image: f.image, category: f.category, brand: f.brand, sku: f.sku,
    price: f.price, discount: f.discount === '' ? 0 : f.discount, stock: f.stock === '' ? 0 : f.stock,
    rating: f.rating === '' ? 0 : f.rating, colors: f.colors, sizes: f.sizes, tags: f.tags,
    featured: f.featured, flashSale: f.flashSale, active: f.active,
  };
  if (f.slug.trim() || !forCreate) p.slug = f.slug.trim();
  return p;
};


// ------------------------------------------------------------------ IT software form and section
type ITFormState = {
  title: string;
  slug: string;
  version: string;
  description: string;
  price: string;
  image: string;
  features: string;
  techStack: string;
  active: boolean;
};


const emptyITForm: ITFormState = {
  title: '', slug: '', version: '1.0.0', description: '', price: '', image: '',
  features: '', techStack: '', active: true,
};


const fromITSoftware = (s: ITSoftware): ITFormState => ({
  title: s.title,
  slug: s.slug,
  version: s.version,
  description: s.description,
  price: String(s.price),
  image: s.image,
  features: s.features.join(', '),
  techStack: s.techStack.join(', '),
  active: s.active,
});


function ITSoftwareForm(props: {
  initial: ITFormState;
  submitLabel: string;
  onSubmit: (f: ITFormState) => Promise<string | null>;
  onCancel?: () => void;
}) {
  const [f, setF] = useState<ITFormState>(props.initial);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const set = <K extends keyof ITFormState>(k: K, v: ITFormState[K]) => setF((s) => ({ ...s, [k]: v }));


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
    <form onSubmit={submit} className="space-y-4 rounded-2xl border border-blue-200 bg-blue-50/30 p-5">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className={label}>Software/service name *</label>
          <input className={field} value={f.title} onChange={(e) => set('title', e.target.value)} required />
        </div>
        <div>
          <label className={label}>Version (e.g., 1.0.0)</label>
          <input className={field} value={f.version} onChange={(e) => set('version', e.target.value)} />
        </div>
        <div>
          <label className={label}>Price (৳) *</label>
          <input className={field} type="number" min="0" step="0.01" value={f.price} onChange={(e) => set('price', e.target.value)} required />
        </div>
        <div className="md:col-span-2">
          <label className={label}>Preview image link *</label>
          <input className={field} value={f.image} onChange={(e) => set('image', e.target.value)} required />
        </div>
        <div className="md:col-span-2">
          <label className={label}>Main description *</label>
          <textarea className={`${field} h-24`} value={f.description} onChange={(e) => set('description', e.target.value)} required />
        </div>
        <div>
          <label className={label}>Features (separate with commas)</label>
          <input className={field} value={f.features} onChange={(e) => set('features', e.target.value)} placeholder="POS, Inventory, Billing" />
        </div>
        <div>
          <label className={label}>Tech stack (separated by commas)</label>
          <input className={field} value={f.techStack} onChange={(e) => set('techStack', e.target.value)} placeholder="Next.js, Node.js, MongoDB" />
        </div>
        <div className="md:col-span-2">
          <label className={label}>URL Slug</label>
          <input className={field} value={f.slug} onChange={(e) => set('slug', e.target.value)} />
        </div>
      </div>


      <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
        <input type="checkbox" checked={f.active} onChange={(e) => set('active', e.target.checked)} /> Publish on the website
      </label>


      {err && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-bold text-red-700">{err}</p>}


      <div className="flex gap-3">
        <button disabled={busy} className={`${btn} bg-indigo-600 text-white hover:bg-indigo-700`}>
          {busy ? 'Saving...' : props.submitLabel}
        </button>
        {props.onCancel && (
          <button type="button" onClick={props.onCancel} className={`${btn} border border-slate-300 bg-white hover:bg-slate-100`}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}


// ------------------------------------------------------------------ Product row
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
      props.notify('Saved');
    } else props.notify(r.error ?? 'Could not be saved');
  }


  async function toggleActive() {
    const r = await api<{ product: AdminProduct }>(`/api/admin/products/${p.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ active: !p.active }),
    });
    if (r.success) props.onChanged(r.product);
    else props.notify(r.error ?? 'Could not be updated');
  }


  async function remove() {
    if (!confirm(`Delete "${p.name}"?`)) return;
    const r = await api<object>(`/api/admin/products/${p.id}`, { method: 'DELETE' });
    if (r.success) props.onDeleted(p.id);
    else props.notify(r.error ?? 'Could not be deleted');
  }


  return (
    <div className={`rounded-2xl border bg-white p-4 shadow-sm ${p.active ? 'border-slate-200' : 'border-amber-300 bg-amber-50/40'}`}>
      <div className="flex flex-wrap items-center gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={p.image} alt="" className="h-16 w-16 rounded-xl bg-slate-100 object-cover" />
        <div className="min-w-[180px] flex-1">
          <p className="font-bold text-slate-900">{p.name}</p>
          <p className="text-xs text-slate-500">
            {p.category} {p.sku ? ` · ${p.sku}` : ''} · Sold {p.sold}
            {!p.active && <b className="ml-2 text-amber-700">Hidden</b>}
          </p>
          <p className="text-xs font-bold text-green-700">
            Price: {formatMoney(p.finalPrice)}
          </p>
        </div>


        <label className="w-28 text-xs font-bold text-slate-600">
          Price ৳
          <input className={field} type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} />
        </label>
        <label className="w-24 text-xs font-bold text-slate-600">
          Discount %
          <input className={field} type="number" min="0" max="90" step="0.01" value={discount} onChange={(e) => setDiscount(e.target.value)} />
        </label>
        <label className="w-24 text-xs font-bold text-slate-600">
          Stock
          <input className={field} type="number" min="0" step="1" value={stock} onChange={(e) => setStock(e.target.value)} />
        </label>


        <div className="flex flex-wrap gap-2">
          <button onClick={quickSave} disabled={!dirty || busy} className={`${btn} bg-green-600 text-white hover:bg-green-700`}>
            {busy ? '...' : 'Save'}
          </button>
          <button onClick={() => setEditing((v) => !v)} className={`${btn} border border-slate-300 hover:bg-slate-100`}>
            Details
          </button>
          <button onClick={toggleActive} className={`${btn} border border-slate-300 hover:bg-slate-100`}>
            {p.active ? 'Hide' : 'Show'}
          </button>
          <button onClick={remove} className={`${btn} bg-red-50 text-red-700 hover:bg-red-100`}>
            Delete
          </button>
        </div>
      </div>


      {editing && (
        <div className="mt-4">
          <ProductForm
            initial={fromProduct(p)}
            submitLabel="Save changes"
            onCancel={() => setEditing(false)}
            onSubmit={async (f) => {
              const r = await api<{ product: AdminProduct }>(`/api/admin/products/${p.id}`, {
                method: 'PATCH',
                body: JSON.stringify(payloadFrom(f, false)),
              });
              if (!r.success) return r.error ?? 'Could not be saved';
              props.onChanged(r.product);
              props.notify('Saved');
              setEditing(false);
              return null;
            }}
          />
        </div>
      )}
    </div>
  );
}


// ------------------------------------------------------------------ Order card
function OrderCard(props: {
  o: AdminOrder;
  currency: Currency;
  onChanged: (id: string, patch: Partial<AdminOrder>) => void;
  notify: (m: string) => void;
}) {
  const { o, currency } = props;
  const [busy, setBusy] = useState(false);
  const locked = o.status === 'Cancelled';


  const sendSmsNotification = (status: string) => {
    props.notify(`[Demo] Notification for ${o.customer.phone}: Order status is now ${status}`);
  };


  async function patch(body: { status?: string; paymentStatus?: string }) {
    setBusy(true);
    const r = await api<{ status: string; paymentStatus: string }>(`/api/admin/orders/${o.id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
    setBusy(false);
    if (r.success) {
      props.onChanged(o.id, { status: r.status, paymentStatus: r.paymentStatus });
      props.notify('Updated');
    } else props.notify(r.error ?? 'Could not be updated');
  }


  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-black text-slate-900">{o.orderNumber}</p>
          <p className="text-xs text-slate-500">{o.createdAt ? new Date(o.createdAt).toLocaleString('bn-BD') : ''}</p>
        </div>
        <p className="text-xl font-black text-green-700">{formatMoney(o.total, currency)}</p>
      </div>


      <div className="mt-3 grid gap-4 md:grid-cols-2">
        <div className="text-sm">
          <p className="font-bold">{o.customer.name}</p>
          <p><a className="text-blue-600 underline" href={`tel:${o.customer.phone}`}>{o.customer.phone}</a></p>
          <p className="text-slate-600">{o.customer.address}</p>
        </div>
        <ul className="space-y-1 text-sm">
          {o.items.map((i, idx) => (
            <li key={idx} className="flex justify-between gap-3">
              <span>{i.name} × {i.quantity}</span>
              <b>{formatMoney(i.unitPrice * i.quantity, currency)}</b>
            </li>
          ))}
        </ul>
      </div>


      <div className="mt-4 flex flex-wrap items-end gap-4 border-t pt-4">
        <label className="text-xs font-bold text-slate-600">
          Payment status
          <select className={field} disabled={busy} value={o.paymentStatus} onChange={(e) => patch({ paymentStatus: e.target.value })}>
            {PAYMENT_STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </label>
        <label className="text-xs font-bold text-slate-600">
          Order status
          <select className={field} disabled={busy || locked} value={o.status} onChange={(e) => patch({ status: e.target.value })}>
            {ORDER_STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </label>
        <button onClick={() => sendSmsNotification(o.status)} className={`${btn} bg-blue-600 text-white hover:bg-blue-700`}>
          Send SMS
        </button>
      </div>
    </div>
  );
}


// ------------------------------------------------------------------ Main admin page
export default function AdminPage() {
  const [auth, setAuth] = useState<AuthState>('loading');
  const [password, setPassword] = useState('');
  const [loginErr, setLoginErr] = useState('');
  const [tab, setTab] = useState<Tab>('products');
  const [currency, setCurrency] = useState<Currency>('BDT');


  const [toast, setToast] = useState('');
  const toastTimer = useRef<number | null>(null);
  const notify = useCallback((m: string) => {
    setToast(m);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(''), 4000);
  }, []);


  // Product state
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loadingP, setLoadingP] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [search, setSearch] = useState('');


  // IT software state
  const [itSoftware, setItSoftware] = useState<ITSoftware[]>([]);
  const [loadingIT, setLoadingIT] = useState(false);
  const [showNewIT, setShowNewIT] = useState(false);
  const [editingIT, setEditingIT] = useState<ITSoftware | null>(null);


  // Order state
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [orderTotal, setOrderTotal] = useState(0);
  const [loadingO, setLoadingO] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [orderQuery, setOrderQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [ordersTick, setOrdersTick] = useState(0);


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
  }, []);


  // Function to load IT software
  const loadITSoftware = useCallback(async () => {
    setLoadingIT(true);
    const r = await api<{ software: ITSoftware[] }>('/api/admin/it-software');
    setLoadingIT(false);
    if (r.success) setItSoftware(r.software);
  }, []);


  const loadOrders = useCallback(async () => {
    setLoadingO(true);
    const qs = new URLSearchParams();
    if (statusFilter) qs.set('status', statusFilter);
    if (appliedQuery) qs.set('q', appliedQuery);
    const r = await api<{ orders: AdminOrder[]; total: number }>(`/api/admin/orders?${qs.toString()}`);
    setLoadingO(false);
    if (r.success) {
      setOrders(r.orders);
      setOrderTotal(r.total);
    }
  }, [statusFilter, appliedQuery]);


  useEffect(() => {
    if (auth === 'ready') {
      void loadProducts();
      void loadITSoftware();
    }
  }, [auth, loadProducts, loadITSoftware]);


  useEffect(() => {
    if (auth === 'ready' && tab === 'orders') void loadOrders();
  }, [auth, tab, loadOrders, ordersTick]);


  async function login(e: FormEvent) {
    e.preventDefault();
    setLoginErr('');
    const r = await api<object>('/api/admin/login', { method: 'POST', body: JSON.stringify({ password }) });
    if (r.success) {
      setPassword('');
      setAuth('ready');
    } else setLoginErr(r.error ?? 'Login failed');
  }


  async function logout() {
    await api<object>('/api/admin/login', { method: 'DELETE' });
    setAuth('login');
  }


  const shown = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) => [p.name, p.sku, p.category, p.brand].join(' ').toLowerCase().includes(q));
  }, [products, search]);


  if (auth === 'loading') return <p className="py-24 text-center font-bold text-slate-500">Loading...</p>;


  if (auth === 'login') {
    return (
      <div className="mx-auto max-w-sm py-20">
        <form onSubmit={login} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow">
          <h1 className="text-2xl font-black text-slate-900">Store and IT Admin</h1>
          <input
            type="password"
            autoFocus
            className={field}
            placeholder="Admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {loginErr && <p className="text-sm font-bold text-red-600">{loginErr}</p>}
          <button className={`${btn} w-full bg-blue-600 py-3 text-white`}>Log in</button>
        </form>
      </div>
    );
  }


  const tabs: { id: Tab; label: string }[] = [
    { id: 'products', label: 'Marketplace Products' },
    { id: 'it-software', label: 'IT Solutions and Software' },
    { id: 'orders', label: 'Order Management' },
    { id: 'blog', label: 'Blog' },
  ];


  return (
    <div className="space-y-6 py-6">
      {toast && (
        <div className="fixed right-5 top-5 z-50 rounded-xl bg-black px-5 py-3 text-sm font-bold text-white shadow-2xl">
          {toast}
        </div>
      )}


      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Smart Family Admin Panel</h1>
          <p className="text-sm text-slate-500">Marketplace and IT solutions management hub</p>
        </div>
        <div className="flex items-center gap-3">
          <select value={currency} onChange={(e) => setCurrency(e.target.value as Currency)} className={field}>
            <option value="BDT">BDT (৳)</option>
            <option value="USD">USD ($)</option>
          </select>
          <button onClick={logout} className={`${btn} border bg-white`}>Log out</button>
        </div>
      </div>


      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`${btn} ${tab === t.id ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
          >
            {t.label}
          </button>
        ))}
      </div>


      {/* Product tab */}
      {tab === 'products' && (
        <section className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <input className={`${field} max-w-sm`} placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} />
            <button onClick={() => setShowNew((v) => !v)} className={`${btn} bg-blue-600 text-white`}>+ New product</button>
          </div>


          {showNew && (
            <ProductForm
              initial={emptyForm}
              submitLabel="Add product"
              onCancel={() => setShowNew(false)}
              onSubmit={async (f) => {
                const r = await api<{ product: AdminProduct }>('/api/admin/products', {
                  method: 'POST',
                  body: JSON.stringify(payloadFrom(f, true)),
                });
                if (!r.success) return r.error ?? 'Could not be saved';
                setProducts((list) => [r.product, ...list]);
                setShowNew(false);
                notify('Successfully added');
                return null;
              }}
            />
          )}


          <div className="space-y-3">
            {shown.map((p) => (
              <ProductRow
                key={p.id}
                p={p}
                notify={notify}
                onChanged={(np) => setProducts((list) => list.map((x) => (x.id === np.id ? np : x)))}
                onDeleted={(id) => setProducts((list) => list.filter((x) => x.id !== id))}
              />
            ))}
          </div>
        </section>
      )}


      {/* IT software tab (newly added) */}
      {tab === 'it-software' && (
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">IT software and service list</h2>
            <button onClick={() => setShowNewIT((v) => !v)} className={`${btn} bg-indigo-600 text-white`}>
              {showNewIT ? 'Close' : '+ New software post'}
            </button>
          </div>


          {showNewIT && (
            <ITSoftwareForm
              initial={emptyITForm}
              submitLabel="Publish software"
              onCancel={() => setShowNewIT(false)}
              onSubmit={async (f) => {
                const r = await api<{ software: ITSoftware }>('/api/admin/it-software', {
                  method: 'POST',
                  body: JSON.stringify({
                    ...f,
                    price: Number(f.price),
                    features: f.features.split(',').map((x) => x.trim()).filter(Boolean),
                    techStack: f.techStack.split(',').map((x) => x.trim()).filter(Boolean),
                  }),
                });
                if (!r.success) return r.error ?? 'Could not be saved';
                setItSoftware((list) => [r.software, ...list]);
                setShowNewIT(false);
                notify('IT software successfully posted');
                return null;
              }}
            />
          )}


          {editingIT && (
            <ITSoftwareForm
              initial={fromITSoftware(editingIT)}
              submitLabel="Update"
              onCancel={() => setEditingIT(null)}
              onSubmit={async (f) => {
                const r = await api<{ software: ITSoftware }>(`/api/admin/it-software/${editingIT.id}`, {
                  method: 'PATCH',
                  body: JSON.stringify({
                    ...f,
                    price: Number(f.price),
                    features: f.features.split(',').map((x) => x.trim()).filter(Boolean),
                    techStack: f.techStack.split(',').map((x) => x.trim()).filter(Boolean),
                  }),
                });
                if (!r.success) return r.error ?? 'Could not be updated';
                setItSoftware((list) => list.map((item) => (item.id === r.software.id ? r.software : item)));
                setEditingIT(null);
                notify('Successfully updated');
                return null;
              }}
            />
          )}


          <div className="grid gap-4 md:grid-cols-2">
            {itSoftware.map((sw) => (
              <div key={sw.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
                <div className="flex items-center gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={sw.image} alt="" className="h-14 w-14 rounded-xl object-cover bg-slate-100" />
                  <div>
                    <h3 className="font-bold text-slate-900">{sw.title}</h3>
                    <p className="text-xs text-slate-500">Version: {sw.version} · Price: {formatMoney(sw.price, currency)}</p>
                  </div>
                </div>
                <p className="text-sm text-slate-600 line-clamp-2">{sw.description}</p>
                <div className="flex gap-2 pt-2">
                  <button onClick={() => setEditingIT(sw)} className={`${btn} border hover:bg-slate-100 text-xs`}>Edit</button>
                  <button
                    onClick={async () => {
                      if (!confirm('Do you want to delete this software?')) return;
                      const r = await api(`/api/admin/it-software/${sw.id}`, { method: 'DELETE' });
                      if (r.success) {
                        setItSoftware((list) => list.filter((x) => x.id !== sw.id));
                        notify('Deleted');
                      }
                    }}
                    className={`${btn} bg-red-50 text-red-700 hover:bg-red-100 text-xs`}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {itSoftware.length === 0 && !loadingIT && (
              <p className="col-span-2 text-center text-slate-500 py-10">No IT software has been posted.</p>
            )}
          </div>
        </section>
      )}


      {/* Order tab */}
      {tab === 'orders' && (
        <section className="space-y-4">
          <div className="flex gap-3">
            <select className={`${field} max-w-[180px]`} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">All orders</option>
              {ORDER_STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
            <input
              className={`${field} max-w-xs`}
              placeholder="Search order number"
              value={orderQuery}
              onChange={(e) => setOrderQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && setAppliedQuery(orderQuery.trim())}
            />
          </div>


          <div className="space-y-3">
            {orders.map((o) => (
              <OrderCard
                key={o.id}
                o={o}
                currency={currency}
                notify={notify}
                onChanged={(id, patch) => setOrders((list) => list.map((x) => (x.id === id ? { ...x, ...patch } : x)))}
              />
            ))}
          </div>
        </section>
      )}


      {tab === 'blog' && <BlogManager notify={notify} />}
    </div>
  );
}