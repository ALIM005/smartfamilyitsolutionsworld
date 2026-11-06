'use client';

// app/admin/page.tsx
// Unified store and IT solutions admin  (VIP theme: navy + gold)
//  - Dashboard: KPIs, low-stock alerts, recent orders & messages
//  - Products: change price/discount/stock/image, new products, hide/delete,
//              duplicate, bulk hide/show/delete, filter/sort, CSV export, image upload
//  - IT software: new software posts, edit, publish/unpublish, feature and tech stack management
//  - Orders: orders from the real API, status and payment status, summary, BDT/USD, CSV export
//  - Blog: BlogManager
//  - Inbox: User contact messages and selected FAQ requirements (search + reply)

import {
  ChangeEvent,
  FormEvent,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import BlogManager from '@/components/admin/BlogManager';

/* =====================================================================
   TYPES
   ===================================================================== */

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

// Contact / Inquiry message type
type ContactMessage = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  selectedFaqs?: string[];
  createdAt: string;
};

type Tab = 'dashboard' | 'products' | 'it-software' | 'orders' | 'blog' | 'inbox';
type AuthState = 'loading' | 'login' | 'ready' | 'unconfigured';
type Currency = 'BDT' | 'USD';
type ToastType = 'success' | 'error' | 'info';
type ProductFilter = 'all' | 'active' | 'hidden' | 'low' | 'out' | 'featured';
type ProductSort = 'new' | 'name' | 'price-asc' | 'price-desc' | 'stock-asc' | 'sold';

/* =====================================================================
   CONSTANTS & HELPERS
   ===================================================================== */

const ORDER_STATUSES = ['Pending', 'Processing', 'Packaging', 'Shipped', 'Delivered', 'Cancelled'];
const PAYMENT_STATUSES = ['Unpaid', 'Paid', 'Refunded'];
const USD_EXCHANGE_RATE = 123.3; // default: 1 USD = ৳123.3 (Nov 2026). Editable from the header.
const RATE_STORAGE_KEY = 'sf_admin_usd_rate';
let currentRate = USD_EXCHANGE_RATE; // the rate formatMoney() uses right now
const applyRate = (r: number) => {
  if (Number.isFinite(r) && r > 0) currentRate = r;
};
const LOW_STOCK = 5;
const PAGE_SIZE = 30;

const formatMoney = (n: number, currency: Currency = 'BDT') => {
  const v = Number(n || 0);
  if (currency === 'USD') {
    return (v / currentRate).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
  return `৳ ${v.toLocaleString('en-BD', { maximumFractionDigits: 2 })}`;
};

const formatDate = (d: string | null | undefined) => (d ? new Date(d).toLocaleString('bn-BD') : '');

const splitList = (s: string) => s.split(',').map((x) => x.trim()).filter(Boolean);

const waLink = (phone: string) => {
  const d = phone.replace(/\D/g, '');
  const n = d.startsWith('880') ? d : d.startsWith('0') ? `88${d}` : d;
  return `https://wa.me/${n}`;
};

/* ---------- VIP theme class names ---------- */
const FULL_BLEED = 'relative w-screen ml-[calc(50%-50vw)]';
const pageBg =
  'min-h-[85vh] bg-gradient-to-br from-[#04062b] via-[#0a1060] to-[#1a0b4a] text-slate-100';
const field =
  'w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder-slate-400 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/25 disabled:opacity-60 [&>option]:text-slate-900';
const labelCls = 'mb-1 block text-xs font-bold text-slate-300';
const btn =
  'rounded-lg px-4 py-2 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300';
const btnGold = `${btn} border border-yellow-200 bg-gradient-to-b from-yellow-300 via-amber-400 to-yellow-600 text-slate-900 shadow-[0_0_16px_rgba(251,191,36,0.35)] hover:brightness-110`;
const btnGhost = `${btn} border border-white/20 bg-white/5 text-slate-100 hover:border-amber-300/60 hover:bg-white/10`;
const btnDanger = `${btn} border border-rose-400/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20`;
const btnGreen = `${btn} bg-emerald-500 text-white hover:bg-emerald-400`;
const panel = 'rounded-2xl border border-amber-400/20 bg-white/5 shadow-lg backdrop-blur';

const STATUS_TONE: Record<string, string> = {
  Pending: 'border-amber-300/30 bg-amber-400/15 text-amber-300',
  Processing: 'border-sky-300/30 bg-sky-400/15 text-sky-300',
  Packaging: 'border-indigo-300/30 bg-indigo-400/15 text-indigo-300',
  Shipped: 'border-violet-300/30 bg-violet-400/15 text-violet-300',
  Delivered: 'border-emerald-300/30 bg-emerald-400/15 text-emerald-300',
  Cancelled: 'border-rose-300/30 bg-rose-400/15 text-rose-300',
};
const PAY_TONE: Record<string, string> = {
  Unpaid: 'border-rose-300/30 bg-rose-400/15 text-rose-300',
  Paid: 'border-emerald-300/30 bg-emerald-400/15 text-emerald-300',
  Refunded: 'border-slate-300/30 bg-slate-400/15 text-slate-300',
};

function Badge({ tone, children }: { tone: string; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wide ${tone}`}>
      {children}
    </span>
  );
}

function downloadCsv(filename: string, rows: (string | number | boolean | null | undefined)[][]) {
  const esc = (v: string | number | boolean | null | undefined) => {
    let s = v === null || v === undefined ? '' : String(v);
    // neutralise spreadsheet formula injection
    if (typeof v === 'string' && /^[=+\-@\t\r]/.test(s)) s = `'${s}`;
    return `"${s.replace(/"/g, '""')}"`;
  };
  const csv = rows.map((r) => r.map(esc).join(',')).join('\r\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/* =====================================================================
   API
   ===================================================================== */

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

/** Image upload via the existing /api/admin/upload route (multipart field "file"; response should contain url). */
async function uploadImage(file: File): Promise<{ url?: string; error?: string }> {
  if (!file.type.startsWith('image/')) return { error: 'Please choose an image file' };
  if (file.size > 5 * 1024 * 1024) return { error: 'Image must be smaller than 5 MB' };
  try {
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
    if (res.status === 401) window.dispatchEvent(new Event('sf-admin-401'));
    const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
    const url = data.url ?? data.path ?? data.imageUrl ?? data.secure_url;
    if (!res.ok || data.success === false || !url) {
      return { error: typeof data.error === 'string' ? data.error : 'Upload failed' };
    }
    return { url: String(url) };
  } catch {
    return { error: 'Upload failed' };
  }
}

/* =====================================================================
   SMALL UI PIECES
   ===================================================================== */

function Field({ label, children, className = '' }: { label: string; children: ReactNode; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className={labelCls}>{label}</span>
      {children}
    </label>
  );
}

function Skeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-3" aria-busy="true" aria-label="Loading">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-20 animate-pulse rounded-2xl border border-white/10 bg-white/5" />
      ))}
    </div>
  );
}

function EmptyState({ icon, text }: { icon: string; text: string }) {
  return (
    <div className={`${panel} px-6 py-14 text-center`}>
      <div className="mb-3 text-4xl" aria-hidden="true">{icon}</div>
      <p className="font-semibold text-slate-300">{text}</p>
    </div>
  );
}

function StatCard(props: { icon: string; label: string; value: string | number; hint?: string; tone?: string; onClick?: () => void }) {
  const inner = (
    <>
      <div className="flex items-center justify-between">
        <span className="text-2xl" aria-hidden="true">{props.icon}</span>
        {props.hint && <span className="text-[11px] font-bold uppercase tracking-wide text-slate-400">{props.hint}</span>}
      </div>
      <p className={`mt-3 text-2xl font-black sm:text-3xl ${props.tone ?? 'text-amber-300'}`}>{props.value}</p>
      <p className="mt-0.5 text-xs font-bold uppercase tracking-wider text-slate-300">{props.label}</p>
    </>
  );
  const cls = `${panel} p-5 text-left transition ${props.onClick ? 'hover:-translate-y-0.5 hover:border-amber-300/50 hover:bg-white/10' : ''}`;
  return props.onClick ? (
    <button type="button" onClick={props.onClick} className={cls}>{inner}</button>
  ) : (
    <div className={cls}>{inner}</div>
  );
}

function ImageField(props: { label: string; value: string; onChange: (v: string) => void }) {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [broken, setBroken] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => setBroken(false), [props.value]);

  async function onFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setBusy(true);
    setMsg('');
    const r = await uploadImage(file);
    setBusy(false);
    if (r.url) props.onChange(r.url);
    else setMsg(r.error ?? 'Upload failed');
  }

  return (
    <div>
      <span className={labelCls}>{props.label}</span>
      <div className="flex gap-2">
        <input
          className={field}
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
          placeholder="https://… or upload →"
          required
        />
        <button type="button" onClick={() => inputRef.current?.click()} disabled={busy} className={`${btnGhost} shrink-0`}>
          {busy ? 'Uploading…' : '⬆ Upload'}
        </button>
        <input ref={inputRef} type="file" accept="image/*" hidden onChange={onFile} />
      </div>
      {msg && <p className="mt-1 text-xs font-bold text-rose-300">{msg}</p>}
      {props.value && !broken && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={props.value}
          alt="Preview"
          onError={() => setBroken(true)}
          className="mt-2 h-24 w-24 rounded-xl border border-white/15 bg-white/5 object-cover"
        />
      )}
    </div>
  );
}

/* =====================================================================
   PRODUCT FORM
   ===================================================================== */

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

  const check = 'flex items-center gap-2 accent-amber-400';

  return (
    <form onSubmit={submit} className={`${panel} space-y-4 p-5`}>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Product name *" className="md:col-span-2">
          <input className={field} value={f.name} onChange={(e) => set('name', e.target.value)} required maxLength={200} />
        </Field>
        <div className="md:col-span-2">
          <ImageField label="Image link (https://...) or upload *" value={f.image} onChange={(v) => set('image', v)} />
        </div>
        <Field label="Original price (৳) *">
          <input className={field} type="number" min="0" step="0.01" value={f.price} onChange={(e) => set('price', e.target.value)} required />
        </Field>
        <Field label="Discount (%)">
          <input className={field} type="number" min="0" max="90" step="0.01" value={f.discount} onChange={(e) => set('discount', e.target.value)} />
        </Field>
        <Field label="Stock (pieces)">
          <input className={field} type="number" min="0" step="1" value={f.stock} onChange={(e) => set('stock', e.target.value)} />
        </Field>
        <Field label="Category *">
          <input className={field} value={f.category} onChange={(e) => set('category', e.target.value)} required maxLength={60} />
        </Field>
        <Field label="Brand">
          <input className={field} value={f.brand} onChange={(e) => set('brand', e.target.value)} maxLength={60} />
        </Field>
        <Field label="SKU">
          <input className={field} value={f.sku} onChange={(e) => set('sku', e.target.value)} maxLength={60} />
        </Field>
        <Field label="Colors (separated by commas)">
          <input className={field} value={f.colors} onChange={(e) => set('colors', e.target.value)} placeholder="Black, White, Blue" />
        </Field>
        <Field label="Sizes (separated by commas)">
          <input className={field} value={f.sizes} onChange={(e) => set('sizes', e.target.value)} placeholder="M, L, XL" />
        </Field>
        <Field label="Tags (separated by commas)">
          <input className={field} value={f.tags} onChange={(e) => set('tags', e.target.value)} />
        </Field>
        <Field label="Rating (0–5)">
          <input className={field} type="number" min="0" max="5" step="0.1" value={f.rating} onChange={(e) => set('rating', e.target.value)} />
        </Field>
        <Field label="URL slug" className="md:col-span-2">
          <input className={field} value={f.slug} onChange={(e) => set('slug', e.target.value)} />
        </Field>
      </div>

      <div className="flex flex-wrap gap-5 text-sm font-bold text-slate-200">
        <label className={check}>
          <input type="checkbox" checked={f.active} onChange={(e) => set('active', e.target.checked)} /> Show in store
        </label>
        <label className={check}>
          <input type="checkbox" checked={f.featured} onChange={(e) => set('featured', e.target.checked)} /> Featured
        </label>
        <label className={check}>
          <input type="checkbox" checked={f.flashSale} onChange={(e) => set('flashSale', e.target.checked)} /> Flash Sale
        </label>
      </div>

      {err && <p role="alert" className="rounded-lg border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-sm font-bold text-rose-300">{err}</p>}

      <div className="flex gap-3">
        <button disabled={busy} className={btnGold}>
          {busy ? 'Saving...' : props.submitLabel}
        </button>
        {props.onCancel && (
          <button type="button" onClick={props.onCancel} className={btnGhost}>
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

/* =====================================================================
   IT SOFTWARE FORM
   ===================================================================== */

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

const itPayload = (f: ITFormState) => ({
  ...f,
  price: Number(f.price),
  features: splitList(f.features),
  techStack: splitList(f.techStack),
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

  return (
    <form onSubmit={submit} className={`${panel} space-y-4 border-indigo-300/30 p-5`}>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Software/service name *" className="md:col-span-2">
          <input className={field} value={f.title} onChange={(e) => set('title', e.target.value)} required />
        </Field>
        <Field label="Version (e.g., 1.0.0)">
          <input className={field} value={f.version} onChange={(e) => set('version', e.target.value)} />
        </Field>
        <Field label="Price (৳) *">
          <input className={field} type="number" min="0" step="0.01" value={f.price} onChange={(e) => set('price', e.target.value)} required />
        </Field>
        <div className="md:col-span-2">
          <ImageField label="Preview image link or upload *" value={f.image} onChange={(v) => set('image', v)} />
        </div>
        <Field label="Main description *" className="md:col-span-2">
          <textarea className={`${field} h-24`} value={f.description} onChange={(e) => set('description', e.target.value)} required />
        </Field>
        <Field label="Features (separate with commas)">
          <input className={field} value={f.features} onChange={(e) => set('features', e.target.value)} placeholder="POS, Inventory, Billing" />
        </Field>
        <Field label="Tech stack (separated by commas)">
          <input className={field} value={f.techStack} onChange={(e) => set('techStack', e.target.value)} placeholder="Next.js, Node.js, MongoDB" />
        </Field>
        <Field label="URL Slug" className="md:col-span-2">
          <input className={field} value={f.slug} onChange={(e) => set('slug', e.target.value)} />
        </Field>
      </div>

      <label className="flex items-center gap-2 text-sm font-bold text-slate-200 accent-amber-400">
        <input type="checkbox" checked={f.active} onChange={(e) => set('active', e.target.checked)} /> Publish on the website
      </label>

      {err && <p role="alert" className="rounded-lg border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-sm font-bold text-rose-300">{err}</p>}

      <div className="flex gap-3">
        <button disabled={busy} className={btnGold}>
          {busy ? 'Saving...' : props.submitLabel}
        </button>
        {props.onCancel && (
          <button type="button" onClick={props.onCancel} className={btnGhost}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

/* =====================================================================
   PRODUCT ROW
   ===================================================================== */

function ProductRow(props: {
  p: AdminProduct;
  currency: Currency;
  selected: boolean;
  onSelect: (id: string, v: boolean) => void;
  onChanged: (p: AdminProduct) => void;
  onDeleted: (id: string) => void;
  onDuplicate: (p: AdminProduct) => void;
  notify: (m: string, t?: ToastType) => void;
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
      props.notify('Saved', 'success');
    } else props.notify(r.error ?? 'Could not be saved', 'error');
  }

  async function toggleActive() {
    const r = await api<{ product: AdminProduct }>(`/api/admin/products/${p.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ active: !p.active }),
    });
    if (r.success) props.onChanged(r.product);
    else props.notify(r.error ?? 'Could not be updated', 'error');
  }

  async function remove() {
    if (!confirm(`Delete "${p.name}"?`)) return;
    const r = await api<object>(`/api/admin/products/${p.id}`, { method: 'DELETE' });
    if (r.success) props.onDeleted(p.id);
    else props.notify(r.error ?? 'Could not be deleted', 'error');
  }

  return (
    <div className={`${panel} p-4 ${p.active ? '' : 'border-amber-300/40 bg-amber-400/5'} ${props.selected ? 'ring-2 ring-amber-400/60' : ''}`}>
      <div className="flex flex-wrap items-center gap-4">
        <input
          type="checkbox"
          aria-label={`Select ${p.name}`}
          checked={props.selected}
          onChange={(e) => props.onSelect(p.id, e.target.checked)}
          className="h-4 w-4 accent-amber-400"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={p.image} alt="" className="h-16 w-16 rounded-xl bg-white/10 object-cover" />
        <div className="min-w-[180px] flex-1">
          <p className="font-bold text-white">{p.name}</p>
          <p className="text-xs text-slate-400">
            {p.category} {p.sku ? ` · ${p.sku}` : ''} · Sold {p.sold}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-emerald-300">Price: {formatMoney(p.finalPrice, props.currency)}</span>
            {!p.active && <Badge tone="border-amber-300/30 bg-amber-400/15 text-amber-300">Hidden</Badge>}
            {p.featured && <Badge tone="border-yellow-300/30 bg-yellow-400/15 text-yellow-300">★ Featured</Badge>}
            {p.flashSale && <Badge tone="border-fuchsia-300/30 bg-fuchsia-400/15 text-fuchsia-300">⚡ Flash</Badge>}
            {p.stock === 0 ? (
              <Badge tone="border-rose-300/30 bg-rose-400/15 text-rose-300">Out of stock</Badge>
            ) : p.stock <= LOW_STOCK ? (
              <Badge tone="border-orange-300/30 bg-orange-400/15 text-orange-300">Low stock</Badge>
            ) : null}
          </div>
        </div>

        <label className="w-28 text-xs font-bold text-slate-300">
          Price ৳
          <input className={field} type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} />
        </label>
        <label className="w-24 text-xs font-bold text-slate-300">
          Discount %
          <input className={field} type="number" min="0" max="90" step="0.01" value={discount} onChange={(e) => setDiscount(e.target.value)} />
        </label>
        <label className="w-24 text-xs font-bold text-slate-300">
          Stock
          <input className={field} type="number" min="0" step="1" value={stock} onChange={(e) => setStock(e.target.value)} />
        </label>

        <div className="flex flex-wrap gap-2">
          <button onClick={quickSave} disabled={!dirty || busy} className={btnGreen}>
            {busy ? '...' : 'Save'}
          </button>
          <button onClick={() => setEditing((v) => !v)} className={btnGhost}>
            Details
          </button>
          <button onClick={() => props.onDuplicate(p)} className={btnGhost} title="Create a hidden copy">
            Duplicate
          </button>
          <button onClick={toggleActive} className={btnGhost}>
            {p.active ? 'Hide' : 'Show'}
          </button>
          <button onClick={remove} className={btnDanger}>
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
              props.notify('Saved', 'success');
              setEditing(false);
              return null;
            }}
          />
        </div>
      )}
    </div>
  );
}

/* =====================================================================
   ORDER CARD
   ===================================================================== */

function OrderCard(props: {
  o: AdminOrder;
  currency: Currency;
  onChanged: (id: string, patch: Partial<AdminOrder>) => void;
  notify: (m: string, t?: ToastType) => void;
}) {
  const { o, currency } = props;
  const [busy, setBusy] = useState(false);
  const locked = o.status === 'Cancelled';

  const sendSmsNotification = (status: string) => {
    props.notify(`[Demo] Notification for ${o.customer.phone}: Order status is now ${status}`, 'info');
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
      props.notify('Updated', 'success');
    } else props.notify(r.error ?? 'Could not be updated', 'error');
  }

  return (
    <div className={`${panel} p-5`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-lg font-black text-white">{o.orderNumber}</p>
          <p className="text-xs text-slate-400">{formatDate(o.createdAt)}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Badge tone={STATUS_TONE[o.status] ?? STATUS_TONE.Pending}>{o.status}</Badge>
            <Badge tone={PAY_TONE[o.paymentStatus] ?? PAY_TONE.Unpaid}>{o.paymentStatus}</Badge>
          </div>
        </div>
        <p className="text-2xl font-black text-emerald-300">{formatMoney(o.total, currency)}</p>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="space-y-1 text-sm">
          <p className="font-bold text-white">{o.customer.name}</p>
          <p className="flex flex-wrap items-center gap-3">
            <a className="text-sky-300 underline" href={`tel:${o.customer.phone}`}>{o.customer.phone}</a>
            <a className="text-xs font-bold text-emerald-300 underline" href={waLink(o.customer.phone)} target="_blank" rel="noopener noreferrer">
              WhatsApp
            </a>
            <button
              type="button"
              className="text-xs font-bold text-slate-300 underline"
              onClick={() => {
                void navigator.clipboard?.writeText(o.customer.phone);
                props.notify('Phone copied', 'info');
              }}
            >
              Copy
            </button>
          </p>
          <p className="text-slate-300">{o.customer.address}</p>
          <p className="pt-1 text-xs text-slate-400">
            Payment: <b className="text-slate-200">{o.paymentMethod || '—'}</b>
            {o.paymentTrxId ? <> · TrxID: <b className="text-slate-200">{o.paymentTrxId}</b></> : null}
            {o.couponCode ? <> · Coupon: <b className="text-amber-300">{o.couponCode}</b></> : null}
          </p>
        </div>

        <div>
          <ul className="space-y-1 text-sm">
            {o.items.map((i, idx) => (
              <li key={idx} className="flex justify-between gap-3">
                <span className="text-slate-200">
                  {i.name} × {i.quantity}
                  {(i.color || i.size) && (
                    <span className="ml-1 text-xs text-slate-400">({[i.color, i.size].filter(Boolean).join(' / ')})</span>
                  )}
                </span>
                <b className="text-white">{formatMoney(i.unitPrice * i.quantity, currency)}</b>
              </li>
            ))}
          </ul>
          <dl className="mt-3 space-y-0.5 border-t border-white/10 pt-2 text-xs text-slate-300">
            <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatMoney(o.subtotal, currency)}</dd></div>
            <div className="flex justify-between"><dt>VAT</dt><dd>{formatMoney(o.vat, currency)}</dd></div>
            <div className="flex justify-between"><dt>Shipping</dt><dd>{formatMoney(o.shipping, currency)}</dd></div>
            {o.discount > 0 && (
              <div className="flex justify-between text-amber-300"><dt>Discount</dt><dd>− {formatMoney(o.discount, currency)}</dd></div>
            )}
          </dl>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-end gap-4 border-t border-white/10 pt-4">
        <label className="text-xs font-bold text-slate-300">
          Payment status
          <select className={field} disabled={busy} value={o.paymentStatus} onChange={(e) => patch({ paymentStatus: e.target.value })}>
            {PAYMENT_STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </label>
        <label className="text-xs font-bold text-slate-300">
          Order status
          <select className={field} disabled={busy || locked} value={o.status} onChange={(e) => patch({ status: e.target.value })}>
            {ORDER_STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </label>
        <button onClick={() => sendSmsNotification(o.status)} className={btnGold}>
          Send SMS
        </button>
      </div>
    </div>
  );
}

/* =====================================================================
   SHELL (full-width dark VIP background for every screen)
   ===================================================================== */

function Shell({ children, center = false }: { children: ReactNode; center?: boolean }) {
  return (
    <div className={`${FULL_BLEED} ${pageBg} ${center ? 'flex items-center justify-center px-4 py-16' : ''}`}>
      <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-fuchsia-600/25 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-amber-400/20 blur-3xl" aria-hidden="true" />
      <div className={center ? 'relative w-full' : 'relative'}>{children}</div>
    </div>
  );
}

/* =====================================================================
   MAIN ADMIN PAGE
   ===================================================================== */

export default function AdminPage() {
  const [auth, setAuth] = useState<AuthState>('loading');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loginBusy, setLoginBusy] = useState(false);
  const [loginErr, setLoginErr] = useState('');
  const [tab, setTab] = useState<Tab>('dashboard');
  const [currency, setCurrency] = useState<Currency>('BDT');
  const [usdRate, setUsdRate] = useState<number>(USD_EXCHANGE_RATE);
  const [rateInput, setRateInput] = useState<string>(String(USD_EXCHANGE_RATE));
  const [rateBusy, setRateBusy] = useState<boolean>(false);
  applyRate(usdRate); // keep formatMoney() in sync before children render

  const [toast, setToast] = useState<{ text: string; type: ToastType } | null>(null);
  const toastTimer = useRef<number | null>(null);
  const notify = useCallback((m: string, type?: ToastType) => {
    const t: ToastType = type ?? (/could not|failed|error/i.test(m) ? 'error' : 'success');
    setToast({ text: m, type: t });
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 4000);
  }, []);

  // Product state
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loadingP, setLoadingP] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [search, setSearch] = useState('');
  const [pFilter, setPFilter] = useState<ProductFilter>('all');
  const [pSort, setPSort] = useState<ProductSort>('new');
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkBusy, setBulkBusy] = useState(false);
  // USD rate: restore the saved value
  useEffect(() => {
    try {
      const s = Number(window.localStorage.getItem(RATE_STORAGE_KEY));
      if (s > 0 && s < 1000) {
        setUsdRate(s);
        setRateInput(String(s));
      }
    } catch {}
  }, []);

  function saveRate(r: number) {
    if (!(r > 0 && r < 1000)) {
      notify('Enter a valid exchange rate', 'error');
      return;
    }
    setUsdRate(r);
    setRateInput(String(r));
    try {
      window.localStorage.setItem(RATE_STORAGE_KEY, String(r));
    } catch {}
  }

  async function fetchLiveRate() {
    setRateBusy(true);
    try {
      const res = await fetch('https://open.er-api.com/v6/latest/USD', { cache: 'no-store' });
      const data = await res.json();
      const r = Number(data?.rates?.BDT);
      if (!res.ok || !(r > 0)) throw new Error('bad response');
      saveRate(Number(r.toFixed(2)));
      notify(`Live rate updated: 1 USD = ৳${r.toFixed(2)}`, 'success');
    } catch {
      notify('Could not fetch the live rate. Please enter it manually.', 'error');
    } finally {
      setRateBusy(false);
    }
  }

  // IT software state
  const [itSoftware, setItSoftware] = useState<ITSoftware[]>([]);
  const [loadingIT, setLoadingIT] = useState(false);
  const [showNewIT, setShowNewIT] = useState(false);
  const [editingIT, setEditingIT] = useState<ITSoftware | null>(null);
  const [itQuery, setItQuery] = useState('');

  // Order state
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [orderTotal, setOrderTotal] = useState(0);
  const [loadingO, setLoadingO] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [orderQuery, setOrderQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [ordersTick, setOrdersTick] = useState(0);
  // unfiltered orders for the dashboard
  const [allOrders, setAllOrders] = useState<AdminOrder[]>([]);
  const [allOrdersTotal, setAllOrdersTotal] = useState(0);

  // Inbox / Messages state
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loadingMsg, setLoadingMsg] = useState(false);
  const [msgQuery, setMsgQuery] = useState('');

  /* ---------- auth bootstrap ---------- */
  useEffect(() => {
    api<{ configured: boolean; authenticated: boolean }>('/api/admin/login').then((r) => {
      if (!r.configured) setAuth('unconfigured');
      else setAuth(r.authenticated ? 'ready' : 'login');
    });
    const on401 = () => setAuth('login');
    window.addEventListener('sf-admin-401', on401);
    return () => window.removeEventListener('sf-admin-401', on401);
  }, []);

  /* ---------- loaders ---------- */
  const loadProducts = useCallback(async () => {
    setLoadingP(true);
    const r = await api<{ products: AdminProduct[] }>('/api/admin/products');
    setLoadingP(false);
    if (r.success) setProducts(r.products);
  }, []);

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

  const loadAllOrders = useCallback(async () => {
    const r = await api<{ orders: AdminOrder[]; total: number }>('/api/admin/orders');
    if (r.success) {
      setAllOrders(r.orders);
      setAllOrdersTotal(r.total);
    }
  }, []);

  const loadMessages = useCallback(async () => {
    setLoadingMsg(true);
    const r = await api<{ messages: ContactMessage[] }>('/api/admin/messages');
    setLoadingMsg(false);
    if (r.success) setMessages(r.messages);
  }, []);

  useEffect(() => {
    if (auth === 'ready') {
      void loadProducts();
      void loadITSoftware();
      void loadMessages();
      void loadAllOrders();
    }
  }, [auth, loadProducts, loadITSoftware, loadMessages, loadAllOrders]);

  useEffect(() => {
    if (auth === 'ready' && tab === 'orders') void loadOrders();
  }, [auth, tab, loadOrders, ordersTick]);

  useEffect(() => {
    if (auth === 'ready' && tab === 'inbox') void loadMessages();
  }, [auth, tab, loadMessages]);

  useEffect(() => setVisible(PAGE_SIZE), [search, pFilter, pSort]);

  /* ---------- auth actions ---------- */
  async function login(e: FormEvent) {
    e.preventDefault();
    setLoginErr('');
    setLoginBusy(true);
    const r = await api<object>('/api/admin/login', { method: 'POST', body: JSON.stringify({ password }) });
    setLoginBusy(false);
    if (r.success) {
      setPassword('');
      setAuth('ready');
    } else setLoginErr(r.error ?? 'Login failed');
  }

  async function logout() {
    await api<object>('/api/admin/login', { method: 'DELETE' });
    setAuth('login');
  }

  /* ---------- product helpers ---------- */
  const shown = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = products.filter((p) => {
      if (q && ![p.name, p.sku, p.category, p.brand].join(' ').toLowerCase().includes(q)) return false;
      switch (pFilter) {
        case 'active': return p.active;
        case 'hidden': return !p.active;
        case 'low': return p.stock > 0 && p.stock <= LOW_STOCK;
        case 'out': return p.stock === 0;
        case 'featured': return p.featured;
        default: return true;
      }
    });
    if (pSort !== 'new') {
      list = [...list].sort((a, b) => {
        switch (pSort) {
          case 'name': return a.name.localeCompare(b.name);
          case 'price-asc': return a.finalPrice - b.finalPrice;
          case 'price-desc': return b.finalPrice - a.finalPrice;
          case 'stock-asc': return a.stock - b.stock;
          case 'sold': return b.sold - a.sold;
          default: return 0;
        }
      });
    }
    return list;
  }, [products, search, pFilter, pSort]);

  const productStats = useMemo(() => {
    const active = products.filter((p) => p.active).length;
    const low = products.filter((p) => p.stock > 0 && p.stock <= LOW_STOCK).length;
    const out = products.filter((p) => p.stock === 0).length;
    const value = products.reduce((s, p) => s + p.finalPrice * p.stock, 0);
    return { total: products.length, active, hidden: products.length - active, low, out, value };
  }, [products]);

  const toggleSelect = (id: string, v: boolean) =>
    setSelected((s) => {
      const n = new Set(s);
      if (v) n.add(id);
      else n.delete(id);
      return n;
    });

  async function bulkSetActive(active: boolean) {
    const ids = [...selected];
    if (!ids.length) return;
    setBulkBusy(true);
    const results = await Promise.all(
      ids.map((id) =>
        api<{ product: AdminProduct }>(`/api/admin/products/${id}`, { method: 'PATCH', body: JSON.stringify({ active }) }),
      ),
    );
    setBulkBusy(false);
    const updated = results.filter((r) => r.success).map((r) => r.product);
    setProducts((list) => list.map((p) => updated.find((u) => u.id === p.id) ?? p));
    notify(`${updated.length} of ${ids.length} updated`, updated.length === ids.length ? 'success' : 'error');
    setSelected(new Set());
  }

  async function bulkDelete() {
    const ids = [...selected];
    if (!ids.length || !confirm(`Delete ${ids.length} selected product(s)? This cannot be undone.`)) return;
    setBulkBusy(true);
    const results = await Promise.all(ids.map((id) => api<object>(`/api/admin/products/${id}`, { method: 'DELETE' })));
    setBulkBusy(false);
    const okIds = ids.filter((_, i) => results[i].success);
    setProducts((list) => list.filter((p) => !okIds.includes(p.id)));
    notify(`${okIds.length} of ${ids.length} deleted`, okIds.length === ids.length ? 'success' : 'error');
    setSelected(new Set());
  }

  async function duplicateProduct(p: AdminProduct) {
    const f: FormState = { ...fromProduct(p), name: `${p.name} (Copy)`, sku: '', slug: '', active: false };
    const r = await api<{ product: AdminProduct }>('/api/admin/products', {
      method: 'POST',
      body: JSON.stringify(payloadFrom(f, true)),
    });
    if (r.success) {
      setProducts((list) => [r.product, ...list]);
      notify('Copy created (hidden). Edit it and publish.', 'success');
    } else notify(r.error ?? 'Could not duplicate', 'error');
  }

  const exportProducts = () =>
    downloadCsv('products.csv', [
      ['Name', 'SKU', 'Category', 'Brand', 'Price', 'Discount %', 'Final price', 'Stock', 'Sold', 'Rating', 'Active', 'Featured', 'Flash sale'],
      ...shown.map((p) => [p.name, p.sku, p.category, p.brand, p.price, p.discount, p.finalPrice, p.stock, p.sold, p.rating, p.active, p.featured, p.flashSale]),
    ]);

  const exportOrders = () =>
    downloadCsv('orders.csv', [
      ['Order', 'Date', 'Customer', 'Phone', 'Address', 'Items', 'Payment method', 'TrxID', 'Payment status', 'Status', 'Subtotal', 'VAT', 'Shipping', 'Discount', 'Total'],
      ...orders.map((o) => [
        o.orderNumber, o.createdAt ?? '', o.customer.name, o.customer.phone, o.customer.address,
        o.items.map((i) => `${i.name} x${i.quantity}`).join('; '),
        o.paymentMethod, o.paymentTrxId, o.paymentStatus, o.status, o.subtotal, o.vat, o.shipping, o.discount, o.total,
      ]),
    ]);

  const patchOrderLocal = (id: string, patch: Partial<AdminOrder>) => {
    setOrders((list) => list.map((x) => (x.id === id ? { ...x, ...patch } : x)));
    setAllOrders((list) => list.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  };

  /* ---------- dashboard numbers ---------- */
  const dash = useMemo(() => {
    const live = allOrders.filter((o) => o.status !== 'Cancelled');
    const sales = live.reduce((s, o) => s + o.total, 0);
    const paid = allOrders.filter((o) => o.paymentStatus === 'Paid').reduce((s, o) => s + o.total, 0);
    const pending = allOrders.filter((o) => o.status === 'Pending').length;
    const byStatus = ORDER_STATUSES.map((s) => ({ s, n: allOrders.filter((o) => o.status === s).length }));
    const max = Math.max(1, ...byStatus.map((b) => b.n));
    return { sales, paid, pending, byStatus, max };
  }, [allOrders]);

  /* ---------- filtered lists ---------- */
  const filteredIT = useMemo(() => {
    const q = itQuery.trim().toLowerCase();
    if (!q) return itSoftware;
    return itSoftware.filter((s) => [s.title, s.description, s.features.join(' '), s.techStack.join(' ')].join(' ').toLowerCase().includes(q));
  }, [itSoftware, itQuery]);

  const filteredMsgs = useMemo(() => {
    const q = msgQuery.trim().toLowerCase();
    if (!q) return messages;
    return messages.filter((m) => [m.name, m.email, m.subject, m.message].join(' ').toLowerCase().includes(q));
  }, [messages, msgQuery]);

  /* =====================================================================
     SCREENS BEFORE THE PANEL
     ===================================================================== */
  if (auth === 'loading') {
    return (
      <Shell center>
        <p className="text-center font-bold text-amber-300">Loading...</p>
      </Shell>
    );
  }

  if (auth === 'unconfigured') {
    return (
      <Shell center>
        <div className={`${panel} mx-auto max-w-md p-8 text-center`}>
          <div className="mb-3 text-4xl" aria-hidden="true">⚙️</div>
          <h1 className="text-2xl font-black text-white">Admin is not configured</h1>
          <p className="mt-2 text-sm text-slate-300">
            The server has no admin password set up yet. Configure it in your environment variables
            (see <code className="text-amber-300">lib/admin-auth.ts</code>), restart the server and reload this page.
          </p>
        </div>
      </Shell>
    );
  }

  if (auth === 'login') {
    return (
      <Shell center>
        <form onSubmit={login} className={`${panel} mx-auto w-full max-w-sm space-y-4 border-amber-400/40 p-8 shadow-[0_0_50px_rgba(99,102,241,0.35)]`}>
          <div className="text-center">
            <div className="text-4xl drop-shadow-[0_0_8px_rgba(250,204,21,0.9)]" aria-hidden="true">👑</div>
            <h1 className="mt-2 text-2xl font-black text-white">Store and IT Admin</h1>
            <p className="text-xs text-slate-400">Smart Family IT Solutions World</p>
          </div>
          <div className="relative">
            <label htmlFor="admin-pw" className="sr-only">Admin password</label>
            <input
              id="admin-pw"
              type={showPw ? 'text' : 'password'}
              autoFocus
              autoComplete="current-password"
              className={`${field} pr-16`}
              placeholder="Admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-2 py-1 text-xs font-bold text-amber-300 hover:bg-white/10"
              aria-label={showPw ? 'Hide password' : 'Show password'}
            >
              {showPw ? 'Hide' : 'Show'}
            </button>
          </div>
          {loginErr && <p role="alert" className="text-sm font-bold text-rose-300">{loginErr}</p>}
          <button disabled={loginBusy} className={`${btnGold} w-full py-3`}>
            {loginBusy ? 'Logging in...' : 'Log in'}
          </button>
        </form>
      </Shell>
    );
  }

  /* =====================================================================
     READY: ADMIN PANEL
     ===================================================================== */
  const tabs: { id: Tab; label: string; icon: string; badge?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'products', label: 'Marketplace Products', icon: '🛍️' },
    { id: 'it-software', label: 'IT Solutions and Software', icon: '💻' },
    { id: 'orders', label: 'Order Management', icon: '📦', badge: dash.pending },
    { id: 'blog', label: 'Blog', icon: '📰' },
    { id: 'inbox', label: 'Inbox / Messages', icon: '📥', badge: messages.length },
  ];

  const allVisibleSelected = shown.length > 0 && shown.slice(0, visible).every((p) => selected.has(p.id));

  return (
    <Shell>
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed right-5 top-5 z-50 max-w-sm rounded-xl border px-5 py-3 text-sm font-bold shadow-2xl backdrop-blur ${
            toast.type === 'error'
              ? 'border-rose-300/50 bg-rose-950/90 text-rose-100'
              : toast.type === 'info'
                ? 'border-sky-300/50 bg-slate-900/90 text-sky-100'
                : 'border-emerald-300/50 bg-emerald-950/90 text-emerald-100'
          }`}
        >
          {toast.type === 'error' ? '⚠️ ' : toast.type === 'info' ? 'ℹ️ ' : '✅ '}
          {toast.text}
        </div>
      )}

      <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-10">
        {/* ---------- Header ---------- */}
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black text-white sm:text-3xl">
              <span aria-hidden="true">👑 </span>Smart Family Admin Panel
            </h1>
            <p className="text-sm text-slate-400">Marketplace and IT solutions management hub</p>
          </div>
          <div className="flex items-center gap-3">
            <label className="sr-only" htmlFor="currency">Currency</label>
            <select id="currency" value={currency} onChange={(e) => setCurrency(e.target.value as Currency)} className={`${field} w-auto`}>
              <option value="BDT">BDT (৳)</option>
              <option value="USD">USD ($)</option>
            </select>
                        {currency === 'USD' && (
              <div className="flex items-center gap-2">
                <label htmlFor="usd-rate" className="text-xs font-bold text-slate-300">1 USD = ৳</label>
                <input
                  id="usd-rate"
                  type="number"
                  min="1"
                  step="0.01"
                  className={`${field} w-24`}
                  value={rateInput}
                  onChange={(e) => setRateInput(e.target.value)}
                  onBlur={() => saveRate(Number(rateInput))}
                  onKeyDown={(e) => e.key === 'Enter' && saveRate(Number(rateInput))}
                />
                <button type="button" onClick={fetchLiveRate} disabled={rateBusy} className={btnGhost}>
                  {rateBusy ? '...' : 'Live rate'}
                </button>
              </div>
            )}
            <button onClick={logout} className={btnGhost}>Log out</button>
          </div>
        </header>

        <div className="mt-6 flex flex-col gap-6 lg:flex-row">
          {/* ---------- Navigation ---------- */}
          <nav aria-label="Admin sections" className="lg:sticky lg:top-4 lg:w-64 lg:shrink-0 lg:self-start">
            <ul className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
              {tabs.map((t) => (
                <li key={t.id} className="shrink-0">
                  <button
                    onClick={() => setTab(t.id)}
                    aria-current={tab === t.id ? 'page' : undefined}
                    className={`${btn} flex w-full items-center gap-3 whitespace-nowrap text-left ${
                      tab === t.id
                        ? 'border border-yellow-200 bg-gradient-to-b from-yellow-300 via-amber-400 to-yellow-600 text-slate-900 shadow-[0_0_16px_rgba(251,191,36,0.35)]'
                        : 'border border-white/10 bg-white/5 text-slate-200 hover:border-amber-300/40 hover:bg-white/10'
                    }`}
                  >
                    <span aria-hidden="true">{t.icon}</span>
                    <span className="flex-1">{t.label}</span>
                    {t.badge !== undefined && t.badge > 0 && (
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1.5 text-[10px] font-bold text-white shadow-sm">
                        {t.badge}
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* ---------- Content ---------- */}
          <main className="min-w-0 flex-1 space-y-6">
            {/* ================= DASHBOARD ================= */}
            {tab === 'dashboard' && (
              <section className="space-y-6" aria-label="Dashboard">
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <StatCard icon="💰" label="Total sales (excl. cancelled)" value={formatMoney(dash.sales, currency)} hint="Loaded orders" onClick={() => setTab('orders')} />
                  <StatCard icon="✅" label="Paid revenue" value={formatMoney(dash.paid, currency)} tone="text-emerald-300" />
                  <StatCard icon="📦" label="Total orders" value={allOrdersTotal || allOrders.length} hint={`${dash.pending} pending`} onClick={() => setTab('orders')} />
                  <StatCard icon="📥" label="Messages" value={messages.length} tone="text-sky-300" onClick={() => setTab('inbox')} />
                  <StatCard icon="🛍️" label="Products" value={productStats.total} hint={`${productStats.active} live`} onClick={() => setTab('products')} />
                  <StatCard icon="⚠️" label="Low / out of stock" value={`${productStats.low} / ${productStats.out}`} tone="text-orange-300" onClick={() => { setPFilter('low'); setTab('products'); }} />
                  <StatCard icon="💻" label="IT software" value={itSoftware.length} tone="text-indigo-300" onClick={() => setTab('it-software')} />
                  <StatCard icon="🏦" label="Inventory value" value={formatMoney(productStats.value, currency)} tone="text-fuchsia-300" />
                </div>

                <div className="grid gap-6 xl:grid-cols-2">
                  <div className={`${panel} p-5`}>
                    <h2 className="mb-4 text-lg font-black text-white">Orders by status</h2>
                    <ul className="space-y-3">
                      {dash.byStatus.map((b) => (
                        <li key={b.s}>
                          <div className="mb-1 flex justify-between text-xs font-bold text-slate-300">
                            <span>{b.s}</span><span>{b.n}</span>
                          </div>
                          <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-yellow-300 to-amber-500 transition-all"
                              style={{ width: `${(b.n / dash.max) * 100}%` }}
                            />
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className={`${panel} p-5`}>
                    <h2 className="mb-4 text-lg font-black text-white">Stock alerts</h2>
                    {products.filter((p) => p.stock <= LOW_STOCK).length === 0 ? (
                      <p className="text-sm text-slate-400">All products are well stocked. 🎉</p>
                    ) : (
                      <ul className="space-y-2">
                        {products
                          .filter((p) => p.stock <= LOW_STOCK)
                          .sort((a, b) => a.stock - b.stock)
                          .slice(0, 6)
                          .map((p) => (
                            <li key={p.id} className="flex items-center justify-between gap-3 text-sm">
                              <span className="truncate text-slate-200">{p.name}</span>
                              <Badge tone={p.stock === 0 ? 'border-rose-300/30 bg-rose-400/15 text-rose-300' : 'border-orange-300/30 bg-orange-400/15 text-orange-300'}>
                                {p.stock === 0 ? 'Out' : `${p.stock} left`}
                              </Badge>
                            </li>
                          ))}
                      </ul>
                    )}
                  </div>

                  <div className={`${panel} p-5`}>
                    <div className="mb-4 flex items-center justify-between">
                      <h2 className="text-lg font-black text-white">Recent orders</h2>
                      <button onClick={() => void loadAllOrders()} className="text-xs font-bold text-amber-300 underline">Refresh</button>
                    </div>
                    {allOrders.length === 0 ? (
                      <p className="text-sm text-slate-400">No orders yet.</p>
                    ) : (
                      <ul className="space-y-2">
                        {allOrders.slice(0, 5).map((o) => (
                          <li key={o.id} className="flex items-center justify-between gap-3 text-sm">
                            <span className="min-w-0">
                              <b className="text-white">{o.orderNumber}</b>
                              <span className="ml-2 truncate text-slate-400">{o.customer.name}</span>
                            </span>
                            <span className="flex shrink-0 items-center gap-2">
                              <Badge tone={STATUS_TONE[o.status] ?? STATUS_TONE.Pending}>{o.status}</Badge>
                              <b className="text-emerald-300">{formatMoney(o.total, currency)}</b>
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className={`${panel} p-5`}>
                    <h2 className="mb-4 text-lg font-black text-white">Latest messages</h2>
                    {messages.length === 0 ? (
                      <p className="text-sm text-slate-400">No messages yet.</p>
                    ) : (
                      <ul className="space-y-3">
                        {messages.slice(0, 3).map((m) => (
                          <li key={m.id} className="text-sm">
                            <p className="font-bold text-white">{m.name} <span className="text-xs font-normal text-slate-400">· {m.subject || 'No Subject'}</span></p>
                            <p className="line-clamp-1 text-slate-300">{m.message}</p>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </section>
            )}

            {/* ================= PRODUCTS ================= */}
            {tab === 'products' && (
              <section className="space-y-4" aria-label="Marketplace products">
                <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-6">
                  <StatCard icon="🛍️" label="Total" value={productStats.total} />
                  <StatCard icon="🟢" label="Live" value={productStats.active} tone="text-emerald-300" onClick={() => setPFilter('active')} />
                  <StatCard icon="🙈" label="Hidden" value={productStats.hidden} tone="text-amber-300" onClick={() => setPFilter('hidden')} />
                  <StatCard icon="⚠️" label="Low stock" value={productStats.low} tone="text-orange-300" onClick={() => setPFilter('low')} />
                  <StatCard icon="⛔" label="Out of stock" value={productStats.out} tone="text-rose-300" onClick={() => setPFilter('out')} />
                  <StatCard icon="🏦" label="Stock value" value={formatMoney(productStats.value, currency)} tone="text-fuchsia-300" />
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <input className={`${field} max-w-sm`} placeholder="Search products..." aria-label="Search products" value={search} onChange={(e) => setSearch(e.target.value)} />
                  <select className={`${field} w-auto`} aria-label="Filter products" value={pFilter} onChange={(e) => setPFilter(e.target.value as ProductFilter)}>
                    <option value="all">All products</option>
                    <option value="active">Live</option>
                    <option value="hidden">Hidden</option>
                    <option value="low">Low stock</option>
                    <option value="out">Out of stock</option>
                    <option value="featured">Featured</option>
                  </select>
                  <select className={`${field} w-auto`} aria-label="Sort products" value={pSort} onChange={(e) => setPSort(e.target.value as ProductSort)}>
                    <option value="new">Default order</option>
                    <option value="name">Name A–Z</option>
                    <option value="price-asc">Price: low → high</option>
                    <option value="price-desc">Price: high → low</option>
                    <option value="stock-asc">Stock: low → high</option>
                    <option value="sold">Best selling</option>
                  </select>
                  <button onClick={() => setShowNew((v) => !v)} className={btnGold}>{showNew ? 'Close' : '+ New product'}</button>
                  <button onClick={exportProducts} className={btnGhost} disabled={!shown.length}>⬇ CSV</button>
                  <button onClick={() => void loadProducts()} className={btnGhost}>↻ Refresh</button>
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
                      notify('Successfully added', 'success');
                      return null;
                    }}
                  />
                )}

                {/* Bulk bar */}
                {shown.length > 0 && (
                  <div className={`${panel} flex flex-wrap items-center gap-3 px-4 py-3`}>
                    <label className="flex items-center gap-2 text-sm font-bold text-slate-200 accent-amber-400">
                      <input
                        type="checkbox"
                        checked={allVisibleSelected}
                        onChange={(e) =>
                          setSelected((s) => {
                            const n = new Set(s);
                            shown.slice(0, visible).forEach((p) => (e.target.checked ? n.add(p.id) : n.delete(p.id)));
                            return n;
                          })
                        }
                      />
                      Select all shown
                    </label>
                    <span className="text-xs text-slate-400">{selected.size} selected · {shown.length} products</span>
                    {selected.size > 0 && (
                      <div className="ml-auto flex flex-wrap gap-2">
                        <button disabled={bulkBusy} onClick={() => void bulkSetActive(true)} className={btnGhost}>Show</button>
                        <button disabled={bulkBusy} onClick={() => void bulkSetActive(false)} className={btnGhost}>Hide</button>
                        <button disabled={bulkBusy} onClick={() => void bulkDelete()} className={btnDanger}>Delete</button>
                        <button onClick={() => setSelected(new Set())} className={btnGhost}>Clear</button>
                      </div>
                    )}
                  </div>
                )}

                {loadingP && products.length === 0 ? (
                  <Skeleton rows={4} />
                ) : shown.length === 0 ? (
                  <EmptyState icon="🛍️" text="No products match your filters." />
                ) : (
                  <div className="space-y-3">
                    {shown.slice(0, visible).map((p) => (
                      <ProductRow
                        key={p.id}
                        p={p}
                        currency={currency}
                        notify={notify}
                        selected={selected.has(p.id)}
                        onSelect={toggleSelect}
                        onDuplicate={(x) => void duplicateProduct(x)}
                        onChanged={(np) => setProducts((list) => list.map((x) => (x.id === np.id ? np : x)))}
                        onDeleted={(id) => {
                          setProducts((list) => list.filter((x) => x.id !== id));
                          setSelected((s) => {
                            const n = new Set(s);
                            n.delete(id);
                            return n;
                          });
                        }}
                      />
                    ))}
                    {shown.length > visible && (
                      <div className="text-center">
                        <button onClick={() => setVisible((v) => v + PAGE_SIZE)} className={btnGhost}>
                          Show more ({shown.length - visible} remaining)
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </section>
            )}

            {/* ================= IT SOFTWARE ================= */}
            {tab === 'it-software' && (
              <section className="space-y-4" aria-label="IT software">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-xl font-black text-white">IT software and service list</h2>
                  <div className="flex flex-wrap gap-3">
                    <input className={`${field} w-56`} placeholder="Search software..." aria-label="Search software" value={itQuery} onChange={(e) => setItQuery(e.target.value)} />
                    <button onClick={() => void loadITSoftware()} className={btnGhost}>↻ Refresh</button>
                    <button onClick={() => setShowNewIT((v) => !v)} className={btnGold}>
                      {showNewIT ? 'Close' : '+ New software post'}
                    </button>
                  </div>
                </div>

                {showNewIT && (
                  <ITSoftwareForm
                    initial={emptyITForm}
                    submitLabel="Publish software"
                    onCancel={() => setShowNewIT(false)}
                    onSubmit={async (f) => {
                      const r = await api<{ software: ITSoftware }>('/api/admin/it-software', {
                        method: 'POST',
                        body: JSON.stringify(itPayload(f)),
                      });
                      if (!r.success) return r.error ?? 'Could not be saved';
                      setItSoftware((list) => [r.software, ...list]);
                      setShowNewIT(false);
                      notify('IT software successfully posted', 'success');
                      return null;
                    }}
                  />
                )}

                {editingIT && (
                  <ITSoftwareForm
                    key={editingIT.id}
                    initial={fromITSoftware(editingIT)}
                    submitLabel="Update"
                    onCancel={() => setEditingIT(null)}
                    onSubmit={async (f) => {
                      const r = await api<{ software: ITSoftware }>(`/api/admin/it-software/${editingIT.id}`, {
                        method: 'PATCH',
                        body: JSON.stringify(itPayload(f)),
                      });
                      if (!r.success) return r.error ?? 'Could not be updated';
                      setItSoftware((list) => list.map((item) => (item.id === r.software.id ? r.software : item)));
                      setEditingIT(null);
                      notify('Successfully updated', 'success');
                      return null;
                    }}
                  />
                )}

                {loadingIT && itSoftware.length === 0 ? (
                  <Skeleton rows={3} />
                ) : filteredIT.length === 0 ? (
                  <EmptyState icon="💻" text="No IT software has been posted." />
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
                    {filteredIT.map((sw) => (
                      <div key={sw.id} className={`${panel} space-y-3 p-5`}>
                        <div className="flex items-center gap-4">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={sw.image} alt="" className="h-14 w-14 rounded-xl bg-white/10 object-cover" />
                          <div className="min-w-0 flex-1">
                            <h3 className="truncate font-bold text-white">{sw.title}</h3>
                            <p className="text-xs text-slate-400">
                              Version: {sw.version} · Price: {formatMoney(sw.price, currency)}
                            </p>
                          </div>
                          <Badge tone={sw.active ? 'border-emerald-300/30 bg-emerald-400/15 text-emerald-300' : 'border-amber-300/30 bg-amber-400/15 text-amber-300'}>
                            {sw.active ? 'Live' : 'Draft'}
                          </Badge>
                        </div>
                        <p className="line-clamp-2 text-sm text-slate-300">{sw.description}</p>
                        {(sw.features.length > 0 || sw.techStack.length > 0) && (
                          <div className="flex flex-wrap gap-1.5">
                            {sw.features.slice(0, 4).map((x) => (
                              <span key={`f-${x}`} className="rounded-full border border-amber-300/30 bg-amber-400/10 px-2 py-0.5 text-[11px] font-semibold text-amber-200">{x}</span>
                            ))}
                            {sw.techStack.slice(0, 4).map((x) => (
                              <span key={`t-${x}`} className="rounded-full border border-indigo-300/30 bg-indigo-400/10 px-2 py-0.5 text-[11px] font-semibold text-indigo-200">{x}</span>
                            ))}
                          </div>
                        )}
                        <div className="flex flex-wrap gap-2 pt-1">
                          <button onClick={() => setEditingIT(sw)} className={`${btnGhost} text-xs`}>Edit</button>
                          <button
                            onClick={async () => {
                              const r = await api<{ software: ITSoftware }>(`/api/admin/it-software/${sw.id}`, {
                                method: 'PATCH',
                                body: JSON.stringify(itPayload({ ...fromITSoftware(sw), active: !sw.active })),
                              });
                              if (r.success) {
                                setItSoftware((list) => list.map((x) => (x.id === r.software.id ? r.software : x)));
                                notify(sw.active ? 'Moved to draft' : 'Published', 'success');
                              } else notify(r.error ?? 'Could not be updated', 'error');
                            }}
                            className={`${btnGhost} text-xs`}
                          >
                            {sw.active ? 'Unpublish' : 'Publish'}
                          </button>
                          <button
                            onClick={async () => {
                              if (!confirm('Do you want to delete this software?')) return;
                              const r = await api(`/api/admin/it-software/${sw.id}`, { method: 'DELETE' });
                              if (r.success) {
                                setItSoftware((list) => list.filter((x) => x.id !== sw.id));
                                notify('Deleted', 'success');
                              } else notify(r.error ?? 'Could not be deleted', 'error');
                            }}
                            className={`${btnDanger} text-xs`}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* ================= ORDERS ================= */}
            {tab === 'orders' && (
              <section className="space-y-4" aria-label="Orders">
                <div className="flex flex-wrap items-center gap-3">
                  <select className={`${field} max-w-[180px]`} aria-label="Filter by status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                    <option value="">All orders</option>
                    {ORDER_STATUSES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                  <input
                    className={`${field} max-w-xs`}
                    placeholder="Search order number"
                    aria-label="Search order number"
                    value={orderQuery}
                    onChange={(e) => setOrderQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && setAppliedQuery(orderQuery.trim())}
                  />
                  <button onClick={() => setAppliedQuery(orderQuery.trim())} className={btnGold}>Search</button>
                  {(appliedQuery || statusFilter) && (
                    <button
                      onClick={() => {
                        setOrderQuery('');
                        setAppliedQuery('');
                        setStatusFilter('');
                      }}
                      className={btnGhost}
                    >
                      Clear
                    </button>
                  )}
                  <button onClick={() => setOrdersTick((n) => n + 1)} className={btnGhost}>↻ Refresh</button>
                  <button onClick={exportOrders} className={btnGhost} disabled={!orders.length}>⬇ CSV</button>
                </div>

                <p className="text-xs font-semibold text-slate-400">
                  Showing {orders.length} of {orderTotal || orders.length} orders
                </p>

                {loadingO && orders.length === 0 ? (
                  <Skeleton rows={3} />
                ) : orders.length === 0 ? (
                  <EmptyState icon="📦" text="No orders found." />
                ) : (
                  <div className="space-y-3">
                    {orders.map((o) => (
                      <OrderCard key={o.id} o={o} currency={currency} notify={notify} onChanged={patchOrderLocal} />
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* ================= INBOX ================= */}
            {tab === 'inbox' && (
              <section className="space-y-4" aria-label="Inbox">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-xl font-black text-white">User Messages &amp; Selected Requirements</h2>
                  <div className="flex gap-3">
                    <input className={`${field} w-56`} placeholder="Search messages..." aria-label="Search messages" value={msgQuery} onChange={(e) => setMsgQuery(e.target.value)} />
                    <button onClick={() => void loadMessages()} className={btnGhost}>↻ Refresh</button>
                  </div>
                </div>

                {loadingMsg && messages.length === 0 ? (
                  <Skeleton rows={3} />
                ) : filteredMsgs.length === 0 ? (
                  <EmptyState icon="📥" text="No messages found in the inbox." />
                ) : (
                  <div className="space-y-3">
                    {filteredMsgs.map((m) => (
                      <div key={m.id} className={`${panel} space-y-3 p-5`}>
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <p className="font-black text-white">
                              {m.name} <span className="text-xs font-normal text-slate-400">({m.email})</span>
                            </p>
                            <p className="text-xs font-bold text-amber-300">Subject: {m.subject || 'No Subject'}</p>
                          </div>
                          <p className="text-xs text-slate-400">{formatDate(m.createdAt)}</p>
                        </div>

                        <p className="whitespace-pre-wrap rounded-xl border border-white/10 bg-black/20 p-3 text-sm text-slate-200">{m.message}</p>

                        {m.selectedFaqs && m.selectedFaqs.length > 0 && (
                          <div className="rounded-xl border border-amber-300/30 bg-amber-400/10 p-3 text-xs">
                            <p className="mb-1 font-bold text-amber-300">Selected FAQs / Requirements:</p>
                            <ul className="list-inside list-disc space-y-1 text-slate-200">
                              {m.selectedFaqs.map((faq, idx) => (
                                <li key={idx}>{faq}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <div className="flex flex-wrap gap-2">
                          {m.email && (
                            <a
                              href={`mailto:${m.email}?subject=${encodeURIComponent(`Re: ${m.subject || 'Your inquiry'}`)}`}
                              className={`${btnGold} text-xs`}
                            >
                              ✉ Reply
                            </a>
                          )}
                          <button
                            onClick={() => {
                              void navigator.clipboard?.writeText(m.email);
                              notify('Email copied', 'info');
                            }}
                            className={`${btnGhost} text-xs`}
                          >
                            Copy email
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* ================= BLOG (kept in a light card so BlogManager stays readable) ================= */}
            {tab === 'blog' && (
              <section aria-label="Blog" className="rounded-2xl border border-amber-400/30 bg-white p-4 text-slate-900 shadow-lg sm:p-6">
                <BlogManager notify={notify} />
              </section>
            )}
          </main>
        </div>
      </div>
    </Shell>
  );
}