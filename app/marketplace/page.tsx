'use client';

import { memo, useCallback, useMemo, useState, useEffect, useRef } from 'react';
import type { FormEvent } from 'react';
import Link from 'next/link';
import FloatingChat from '@/components/FloatingChat';
/*
  Smart Family Point palette
  Blush pink : #FFF4F6 / #FDE6EC / #FBD3DE      Magenta : #B0124F → #D81B7A
  Plum       : #4A0F2E / #2E0A1C (text)         Gold    : #C9A24B / #E3B964
  Muted text : #7A5566
  Hero photo : put your family photo at  public/images/family.jpg
*/

const BRAND = 'Smart Family Point';
const TAGLINE = 'Together for a Better Life';
const HERO_IMAGE = '/images/family.jpg';
const LOGO_IMAGE = '/images/logo.png'; // public/images/logo.png

/* ---------- Currency ---------- */
type Currency = 'BDT' | 'USD';

// Prices from /api/products are BDT. USD = BDT / rate (set NEXT_PUBLIC_BDT_PER_USD in .env).
const BDT_PER_USD: number = Number(process.env.NEXT_PUBLIC_BDT_PER_USD) || 120;
const CURRENCY_STORAGE_KEY = 'preferred_currency';
const usdFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

const formatPrice = (amountBDT: number, currency: Currency): string =>
  currency === 'USD'
    ? usdFormatter.format(amountBDT / BDT_PER_USD)
    : `৳${Math.round(amountBDT).toLocaleString('en-BD')}`;

/* ---------- Types ---------- */
interface NavLink {
  label: string;
  href: string;
}

interface Product {
  id: string;
  name: string;
  price: number; // BDT
  image: string | null;
  category?: string; // optional category slug, e.g. 'fashion'
}

interface Category {
  slug: string;
  name: string;
  icon: string;
  off: number;
}

type CartState = Record<string, number>;

interface ProductCardProps {
  product: Product;
  currency: Currency;
  wished: boolean;
  compared: boolean;
  onAdd: (id: string) => void;
  onWish: (id: string) => void;
  onCompare: (id: string) => void;
}

interface CurrencySelectProps {
  id: string;
  value: Currency;
  onChange: (value: Currency) => void;
  className?: string;
  dark?: boolean;
}

/* ---------- Data ---------- */
const NAV_LINKS: readonly NavLink[] = [
  { label: 'Home', href: '#home' },
  { label: 'Shop', href: '#products' },
  { label: 'About Us', href: '/marketplace/about' }, // সঠিক পাথ
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/marketplace/contact' }, // সঠিক পাথ
];

const CATEGORIES: readonly Category[] = [
  { slug: 'electronics', name: 'Electronics', icon: '🎧', off: 50 },
  { slug: 'fashion', name: 'Fashion', icon: '👗', off: 40 },
  { slug: 'home-living', name: 'Home & Living', icon: '🛋️', off: 45 },
  { slug: 'beauty', name: 'Beauty', icon: '💄', off: 45 },
  { slug: 'sports', name: 'Sports', icon: '👟', off: 40 },
  { slug: 'accessories', name: 'Accessories', icon: '🕶️', off: 60 },
];

const FEATURES: readonly { icon: string; title: string; text: string }[] = [
  { icon: '💎', title: 'Best Quality', text: 'Premium Products' },
  { icon: '🚚', title: 'Free Delivery', text: 'Across Bangladesh' },
  { icon: '🛡️', title: 'Secure Payment', text: '100% Trusted' },
  { icon: '🎧', title: '24/7 Support', text: 'Always Here for You' },
];

const LEADERS: readonly { name: string; role: string }[] = [
  { name: 'MD HAFIZ SHAMSUDDUHA', role: 'Chairman' },
  { name: 'H M ALIM UDDIN', role: 'Managing Director (MD)' },
  { name: 'MD BALAL HOSSAIN', role: 'Director' },
  { name: 'MD ISLAM UDDIN', role: 'Director' },
];

const PROMISES: readonly string[] = ['Premium Quality', 'Trusted Brand', 'Easy Return', 'Best Price'];

// Replace '#' with your real page URLs
const SOCIALS: readonly { label: string; href: string; text: string; bg: string }[] = [
  { label: 'Facebook', href: '#', text: 'f', bg: 'bg-[#1877F2]' },
  { label: 'YouTube', href: '#', text: '▶', bg: 'bg-[#E11D2E]' },
  { label: 'Instagram', href: '#', text: '◎', bg: 'bg-linear-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF]' },
  { label: 'TikTok', href: '#', text: '♪', bg: 'bg-black' },
];

/* ---------- Style tokens ---------- */
const container = 'mx-auto w-full max-w-[1920px] px-4 sm:px-6 lg:px-10 2xl:px-16';
const focusRing =
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B0124F] focus-visible:ring-offset-2';
const gradientBtn =
  'bg-linear-to-r from-[#B0124F] to-[#D81B7A] text-white shadow-md shadow-[#B0124F]/30 transition hover:from-[#990F44] hover:to-[#C21769] motion-reduce:transition-none';
const goldBtn =
  'bg-linear-to-r from-[#E3B964] to-[#C9A24B] text-[#2E0A1C] shadow-md shadow-black/10 transition hover:brightness-105 motion-reduce:transition-none';
const dropLink = 'hover:text-[#B0124F] hover:underline';
const navItem = (label: string): string =>
  `rounded border-b-2 pb-1 hover:text-[#E3B964] ${label === 'Home' ? 'border-white' : 'border-transparent'} ${focusRing}`;

/* ---------- Small icons ---------- */
const iconProps = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  viewBox: '0 0 24 24',
  'aria-hidden': true,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};
const SearchIcon = ({ className = 'h-5 w-5' }: { className?: string }) => (
  <svg className={className} {...iconProps}><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
);
const HeartIcon = ({ className = 'h-6 w-6', filled = false }: { className?: string; filled?: boolean }) => (
  <svg className={className} {...iconProps} fill={filled ? 'currentColor' : 'none'}>
    <path d="M12 21s-8-5.2-8-11a4.5 4.5 0 018-2.8A4.5 4.5 0 0120 10c0 5.8-8 11-8 11z" />
  </svg>
);
const CompareIcon = ({ className = 'h-6 w-6' }: { className?: string }) => (
  <svg className={className} {...iconProps}><path d="M4 8h14l-3-3M20 16H6l3 3" /></svg>
);
const UserIcon = ({ className = 'h-6 w-6' }: { className?: string }) => (
  <svg className={className} {...iconProps}><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" /></svg>
);
const CartIcon = ({ className = 'h-6 w-6' }: { className?: string }) => (
  <svg className={className} {...iconProps}>
    <path d="M3 4h2l2.4 11h10.2L20 7H6.2" /><circle cx="9" cy="19" r="1.5" /><circle cx="17" cy="19" r="1.5" />
  </svg>
);
const Chevron = ({ open = false }: { open?: boolean }) => (
  <svg className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} {...iconProps}>
    <path d="M19 9l-7 7-7-7" />
  </svg>
);

const Badge = ({ count }: { count: number }) => (
  <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#B0124F] px-1 text-[10px] font-bold text-white">
    {count}
  </span>
);

/* ---------- Family Leadership (dropdown content) ---------- */
function ChevronBadge({ open }: { open: boolean }) {
  return (
    <span
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-[#F3D98B] to-[#C9A24B] text-[#2E0A1C] shadow-md transition-transform duration-200 motion-reduce:transition-none ${open ? 'rotate-180' : ''
        }`}
      aria-hidden="true"
    >
      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M5 9l7 7 7-7" />
      </svg>
    </span>
  );
}

function LeadershipPanel() {
  return (
    <div>
      <div className="mb-3 flex items-center gap-3 rounded-2xl bg-linear-to-b from-[#6E0F3D] to-[#4A0F2E] px-4 py-3 text-white">
        <img
          src={LOGO_IMAGE}
          alt=""
          width={56}
          height={56}
          loading="lazy"
          decoding="async"
          className="h-14 w-14 shrink-0 rounded-full ring-2 ring-[#E3B964]"
        />
        <div className="min-w-0">
          <p className="font-serif text-lg font-bold leading-tight">{BRAND}</p>
          <p className="text-xs italic text-[#E3B964]">— Family Leadership —</p>
        </div>
      </div>
      <ul className="space-y-2">
        {LEADERS.map((l) => (
          <li key={l.name} className="flex items-center gap-3 rounded-2xl border border-[#F3C6D3] bg-white/80 p-2.5">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#4A0F2E] text-[#E3B964] ring-2 ring-[#E3B964]/70">
              <UserIcon className="h-7 w-7" />
            </span>
            <span className="min-w-0">
              <span className="block text-xs font-extrabold leading-tight text-[#2E0A1C] sm:text-sm">{l.name}</span>
              <span className="mt-1 inline-block rounded-full bg-linear-to-r from-[#B0124F] to-[#D81B7A] px-3 py-0.5 text-[11px] font-semibold text-white">
                {l.role}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- Logo ---------- */
function Logo() {
  return (
    <a href="#home" className={`flex shrink-0 items-center gap-2 rounded ${focusRing}`} aria-label={`${BRAND} home`}>
      <img
        src={LOGO_IMAGE}
        alt=""
        width={64}
        height={64}
        decoding="async"
        className="h-11 w-11 shrink-0 rounded-full shadow-md shadow-[#4A0F2E]/30 sm:h-16 sm:w-16"
      />
      <span className="flex flex-col leading-none">
        <span className="font-serif text-xl font-extrabold tracking-wide text-[#4A0F2E] sm:text-3xl">SMART</span>
        <span className="font-serif text-sm font-extrabold tracking-wide text-[#B0124F] sm:text-2xl">FAMILY POINT</span>
        <span className="mt-0.5 hidden text-[10px] italic text-[#4A0F2E] sm:block">— {TAGLINE} —</span>
      </span>
    </a>
  );
}

/* ---------- Search form ---------- */
function SearchForm({
  id,
  value,
  onChange,
  onSubmit,
  className = '',
  buttonLabel,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  className?: string;
  buttonLabel?: string;
}) {
  return (
    <form
      role="search"
      onSubmit={(e: FormEvent) => {
        e.preventDefault();
        onSubmit();
      }}
      className={`flex items-center overflow-hidden rounded-full border border-[#F3C6D3] bg-white shadow-sm ${className}`}
    >
      <label htmlFor={id} className="sr-only">
        Search for products
      </label>
      {buttonLabel && <SearchIcon className="ml-4 h-5 w-5 shrink-0 text-[#4A0F2E]" />}
      <input
        id={id}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search for products..."
        className="min-w-0 flex-1 bg-transparent px-4 py-2.5 text-sm text-[#2E0A1C] placeholder:text-[#B590A0] focus:outline-none"
      />
      <button
        type="submit"
        aria-label="Search"
        className={`flex items-center justify-center self-stretch px-5 text-sm font-semibold ${gradientBtn} ${focusRing}`}
      >
        {buttonLabel ?? <SearchIcon />}
      </button>
    </form>
  );
}

/* ---------- Currency dropdown ---------- */
function CurrencySelect({ id, value, onChange, className = '', dark = false }: CurrencySelectProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="sr-only">
        Currency
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value as Currency)}
        className={`cursor-pointer rounded-full border py-1 pl-3 pr-7 text-sm font-semibold ${dark
            ? 'border-white/30 bg-transparent text-white [&>option]:text-[#2E0A1C]'
            : 'border-[#F3C6D3] bg-white text-[#4A0F2E] hover:bg-[#FDE6EC]'
          } ${focusRing}`}
      >
        <option value="BDT">৳ BDT</option>
        <option value="USD">$ USD</option>
      </select>
    </div>
  );
}

/* ---------- Product card ---------- */
const ProductCard = memo(function ProductCard({
  product,
  currency,
  wished,
  compared,
  onAdd,
  onWish,
  onCompare,
}: ProductCardProps) {
  const { id, name, price, image } = product;
  return (
    <li>
      <article className="flex h-full flex-col rounded-2xl border border-[#F3C6D3] bg-white p-3 shadow-md shadow-[#B0124F]/5 transition-shadow hover:shadow-xl hover:shadow-[#B0124F]/15 motion-reduce:transition-none sm:p-4">
        <div className="relative mb-3 sm:mb-4">
          {image ? (
            <img
              src={image}
              alt={name}
              loading="lazy"
              decoding="async"
              width={400}
              height={300}
              className="aspect-square w-full rounded-xl object-cover sm:aspect-4/3"
            />
          ) : (
            <div
              role="img"
              aria-label={`${name} image coming soon`}
              className="flex aspect-square w-full items-center justify-center rounded-xl bg-linear-to-br from-[#FDE6EC] to-[#FBD3DE] px-2 text-center text-xs text-[#7A5566] sm:aspect-4/3 sm:text-sm"
            >
              Image coming soon
            </div>
          )}
          <div className="absolute right-2 top-2 flex flex-col gap-1.5">
            <button
              type="button"
              onClick={() => onWish(id)}
              aria-pressed={wished}
              aria-label={wished ? `Remove ${name} from wishlist` : `Add ${name} to wishlist`}
              className={`rounded-full bg-white/95 p-1.5 shadow ${wished ? 'text-[#B0124F]' : 'text-[#7A5566]'} ${focusRing}`}
            >
              <HeartIcon className="h-4 w-4" filled={wished} />
            </button>
            <button
              type="button"
              onClick={() => onCompare(id)}
              aria-pressed={compared}
              aria-label={compared ? `Remove ${name} from compare` : `Add ${name} to compare`}
              className={`rounded-full bg-white/95 p-1.5 shadow ${compared ? 'text-[#B0124F]' : 'text-[#7A5566]'} ${focusRing}`}
            >
              <CompareIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
        <h3 className="mb-1 font-serif text-sm font-semibold text-[#2E0A1C] sm:text-lg">{name}</h3>
        <p className="mb-3 text-sm font-bold text-[#B0124F] sm:text-base">{formatPrice(price, currency)}</p>
        <button
          type="button"
          onClick={() => onAdd(id)}
          aria-label={`Add ${name} to cart`}
          className={`mt-auto w-full rounded-full py-2 text-xs font-semibold sm:py-2.5 sm:text-sm ${gradientBtn} ${focusRing}`}
        >
          Add to cart
        </button>
      </article>
    </li>
  );
});

/* ---------- Page ---------- */
export default function MarketplacePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [cart, setCart] = useState<CartState>({});
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [announcement, setAnnouncement] = useState<string>('');
  const [accountDropdownOpen, setAccountDropdownOpen] = useState<boolean>(false);
  const [catMenuOpen, setCatMenuOpen] = useState<boolean>(false);
  const [currency, setCurrency] = useState<Currency>('BDT');
  const [query, setQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [showWishlistOnly, setShowWishlistOnly] = useState<boolean>(false);
  const [compare, setCompare] = useState<string[]>([]);
  const [compareOpen, setCompareOpen] = useState<boolean>(false);
  const [leadersOpen, setLeadersOpen] = useState<boolean>(false);
  const [mobileLeadersOpen, setMobileLeadersOpen] = useState<boolean>(false);
  const leadersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CURRENCY_STORAGE_KEY);
      if (saved === 'BDT' || saved === 'USD') setCurrency(saved);
    } catch {
      /* storage unavailable – keep default */
    }
  }, []);

  // This page is a full-screen layer: lock the page behind it so only one scrollbar shows
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  // Close the Family Leadership menu on outside click / touch / Escape
  useEffect(() => {
    if (!leadersOpen) return;
    const onPointerDown = (e: MouseEvent | TouchEvent): void => {
      if (leadersRef.current && !leadersRef.current.contains(e.target as Node)) setLeadersOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') setLeadersOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('touchstart', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('touchstart', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [leadersOpen]);

  const handleCurrencyChange = useCallback((next: Currency): void => {
    setCurrency(next);
    try {
      localStorage.setItem(CURRENCY_STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  // এপিআই থেকে প্রোডাক্ট ফেচ করা
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products');
        const json = await res.json();
        if (json.success) {
          setProducts(json.data);
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const cartCount = useMemo<number>(
    () => Object.values(cart).reduce((sum: number, qty: number) => sum + qty, 0),
    [cart]
  );

  const handleAdd = useCallback(
    (id: string): void => {
      setCart((prev: CartState): CartState => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));
      const item = products.find((p) => p.id === id);
      if (item) setAnnouncement(`${item.name} added to cart`);
    },
    [products]
  );

  const handleWish = useCallback((id: string): void => {
    setWishlist((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }, []);

  const handleCompare = useCallback((id: string): void => {
    setCompare((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 4) {
        setAnnouncement('You can compare up to 4 products');
        return prev;
      }
      return [...prev, id];
    });
  }, []);

  const scrollToProducts = useCallback((): void => {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const selectCategory = useCallback(
    (slug: string): void => {
      setActiveCategory(slug);
      setCatMenuOpen(false);
      setMenuOpen(false);
      scrollToProducts();
    },
    [scrollToProducts]
  );

  const visibleProducts = useMemo<Product[]>(() => {
    const q = query.trim().toLowerCase();
    return products.filter(
      (p) =>
        (!q || p.name.toLowerCase().includes(q)) &&
        (!activeCategory || p.category === activeCategory) &&
        (!showWishlistOnly || wishlist.includes(p.id))
    );
  }, [products, query, activeCategory, showWishlistOnly, wishlist]);

  const comparedProducts = useMemo<Product[]>(
    () => products.filter((p) => compare.includes(p.id)),
    [products, compare]
  );

  const activeCategoryName = CATEGORIES.find((c) => c.slug === activeCategory)?.name;
  const hasFilter = Boolean(query.trim() || activeCategory || showWishlistOnly);
  const clearFilters = (): void => {
    setQuery('');
    setActiveCategory('');
    setShowWishlistOnly(false);
  };

  const year = new Date().getFullYear();

  return (
    <div className="fixed inset-0 z-60 overflow-y-auto overflow-x-hidden overscroll-contain bg-linear-to-b from-[#FFF4F6] via-[#FFF9FA] to-[#FDE6EC] text-[#2E0A1C]">
      <div className="flex min-h-full w-full flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:text-[#B0124F] focus:shadow"
        >
          Skip to main content
        </a>

        {/* ===== Top bar ===== */}
        <div className="bg-[#4A0F2E] text-white">
          <div className={`${container} flex items-center justify-between gap-4 py-2 text-[11px] font-medium sm:text-xs`}>
            <p className="mx-auto md:hidden">
              <span className="text-[#E3B964]">✦</span> Fast Delivery All Over Bangladesh{' '}
              <span className="text-[#E3B964]">✦</span>
            </p>
            <ul className="hidden items-center gap-6 md:flex">
              <li>🚚 Fast Delivery All Over Bangladesh</li>
              <li className="border-l border-white/30 pl-6">🛡️ 100% Secure Payment</li>
              <li className="border-l border-white/30 pl-6">🎧 24/7 Customer Support</li>
            </ul>
            <div className="hidden items-center gap-4 sm:flex">
              <ul className="flex items-center gap-2">
                {SOCIALS.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      aria-label={s.label}
                      className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold text-white ${s.bg} ${focusRing}`}
                    >
                      {s.text}
                    </a>
                  </li>
                ))}
              </ul>
              <CurrencySelect id="currency-top" value={currency} onChange={handleCurrencyChange} dark />
            </div>
          </div>
        </div>

        {/* ===== Header (sticky) ===== */}
        <header id="home" className="sticky top-0 z-40 shadow-md shadow-[#B0124F]/10">
          <div className="border-b border-[#F3C6D3] bg-linear-to-r from-[#FFF4F6] via-[#FDE6EC] to-[#FFF4F6]">
            <div className={`${container} flex items-center justify-between gap-3 py-2 sm:gap-6 sm:py-3`}>
              <Logo />

              <SearchForm
                id="search-header"
                value={query}
                onChange={setQuery}
                onSubmit={scrollToProducts}
                className="mx-4 hidden max-w-2xl flex-1 md:flex"
              />

              <div className="flex items-center gap-1 sm:gap-4 lg:gap-6">
                {/* Wishlist */}
                <button
                  type="button"
                  onClick={() => {
                    setShowWishlistOnly((v) => !v);
                    scrollToProducts();
                  }}
                  aria-pressed={showWishlistOnly}
                  aria-label={`Wishlist, ${wishlist.length} items`}
                  className={`hidden flex-col items-center text-xs font-medium text-[#4A0F2E] hover:text-[#B0124F] sm:flex ${focusRing}`}
                >
                  <span className="relative"><HeartIcon /><Badge count={wishlist.length} /></span>
                  Wishlist
                </button>

                {/* Compare */}
                <button
                  type="button"
                  onClick={() => setCompareOpen((v) => !v)}
                  aria-expanded={compareOpen}
                  aria-label={`Compare, ${compare.length} items`}
                  className={`hidden flex-col items-center text-xs font-medium text-[#4A0F2E] hover:text-[#B0124F] sm:flex ${focusRing}`}
                >
                  <span className="relative"><CompareIcon /><Badge count={compare.length} /></span>
                  Compare
                </button>

                {/* Account dropdown */}
                <div
                  className="static sm:relative"
                  onPointerEnter={(e) => e.pointerType === 'mouse' && setAccountDropdownOpen(true)}
                  onPointerLeave={(e) => e.pointerType === 'mouse' && setAccountDropdownOpen(false)}
                  onKeyDown={(e) => e.key === 'Escape' && setAccountDropdownOpen(false)}
                >
                  <button
                    type="button"
                    onClick={() => setAccountDropdownOpen((prev) => !prev)}
                    className={`flex flex-col items-center text-xs font-medium text-[#4A0F2E] hover:text-[#B0124F] ${focusRing}`}
                    aria-expanded={accountDropdownOpen}
                    aria-haspopup="true"
                    aria-label="Account and lists"
                  >
                    <UserIcon />
                    <span className="hidden items-center gap-0.5 sm:flex">Account <Chevron open={accountDropdownOpen} /></span>
                  </button>

                  {accountDropdownOpen && (
                    <div className="absolute inset-x-3 top-full z-50 pt-2 sm:inset-x-auto sm:right-0 sm:w-80">
                      <div className="relative rounded-2xl border border-[#F3C6D3] bg-white p-4 shadow-xl shadow-[#B0124F]/15">
                        <div className="flex flex-col items-center border-b border-[#F3C6D3] pb-3 text-center">
                          <Link
                            href="/login"
                            className={`w-full rounded-full py-2 text-center text-sm font-semibold ${gradientBtn}`}
                          >
                            Sign in
                          </Link>
                          <p className="mt-2 text-xs text-[#7A5566]">
                            New customer?{' '}
                            <Link href="/login" className="font-medium text-[#B0124F] hover:underline">
                              Start here.
                            </Link>
                          </p>
                        </div>
                        <div className="mt-3 grid grid-cols-2 gap-4 text-left text-xs">
                          <div>
                            <h4 className="mb-2 font-bold text-[#4A0F2E]">Your Lists</h4>
                            <ul className="space-y-1.5 text-[#7A5566]">
                              <li><a href="#" className={dropLink}>Create a List</a></li>
                              <li><a href="#" className={dropLink}>Find a List or Registry</a></li>
                              <li><a href="#" className={dropLink}>Wish List</a></li>
                            </ul>
                          </div>
                          <div className="border-l border-[#F3C6D3] pl-3">
                            <h4 className="mb-2 font-bold text-[#4A0F2E]">Your Account</h4>
                            <ul className="space-y-1.5 text-[#7A5566]">
                              <li><Link href="/login" className={dropLink}>Account</Link></li>
                              <li><a href="#" className={dropLink}>Orders</a></li>
                              <li><a href="#" className={dropLink}>Recommendations</a></li>
                              <li><a href="#" className={dropLink}>Browsing History</a></li>
                              <li><a href="#" className={dropLink}>Watchlist</a></li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Cart */}
                <Link
                  href="/cart"
                  aria-label={`Cart, ${cartCount} ${cartCount === 1 ? 'item' : 'items'}`}
                  className={`flex flex-col items-center text-xs font-medium text-[#4A0F2E] hover:text-[#B0124F] ${focusRing}`}
                >
                  <span className="relative"><CartIcon /><Badge count={cartCount} /></span>
                  <span className="hidden sm:block">Cart</span>
                </Link>

                {/* Mobile menu button */}
                <button
                  type="button"
                  className={`rounded p-2 text-[#4A0F2E] md:hidden ${focusRing}`}
                  aria-expanded={menuOpen}
                  aria-controls="mobile-menu"
                  aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                  onClick={() => setMenuOpen((open) => !open)}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                    {menuOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
                  </svg>
                </button>
              </div>
            </div>

            {/* Mobile search row */}
            <div className="px-4 pb-3 md:hidden">
              <SearchForm id="search-mobile" value={query} onChange={setQuery} onSubmit={scrollToProducts} />
            </div>
          </div>

          {/* Burgundy navigation bar (desktop) */}
          <div className="hidden bg-linear-to-r from-[#4A0F2E] via-[#6E0F3D] to-[#4A0F2E] text-white md:block">
            <div className={`${container} flex items-center justify-between gap-6 py-2`}>
              <div className="relative" onKeyDown={(e) => e.key === 'Escape' && setCatMenuOpen(false)}>
                <button
                  type="button"
                  onClick={() => setCatMenuOpen((v) => !v)}
                  aria-expanded={catMenuOpen}
                  aria-haspopup="true"
                  className={`flex items-center gap-3 rounded-full bg-linear-to-r from-[#B0124F] to-[#D81B7A] px-5 py-2.5 text-sm font-semibold shadow-md ${focusRing}`}
                >
                  <span aria-hidden="true">☰</span> All Categories <Chevron open={catMenuOpen} />
                </button>
                {catMenuOpen && (
                  <ul className="absolute left-0 top-full z-50 mt-2 w-64 rounded-2xl border border-[#F3C6D3] bg-white p-2 text-[#2E0A1C] shadow-xl">
                    {CATEGORIES.map((c) => (
                      <li key={c.slug}>
                        <button
                          type="button"
                          onClick={() => selectCategory(c.slug)}
                          className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm hover:bg-[#FDE6EC] ${focusRing}`}
                        >
                          <span aria-hidden="true">{c.icon}</span> {c.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <nav aria-label="Primary" className="flex flex-1 items-center justify-center gap-6 text-sm font-semibold lg:gap-10">
                {NAV_LINKS.map((link) =>
                  link.href.startsWith('/') ? (
                    <Link key={link.label} href={link.href} className={navItem(link.label)}>
                      {link.label}
                    </Link>
                  ) : (
                    <a key={link.label} href={link.href} className={navItem(link.label)}>
                      {link.label}
                    </a>
                  )
                )}
                {/* Admin বাটনের পরিবর্তে IT Solutions বাটন */}
                <Link href="/" className={`rounded hover:text-[#E3B964] ${focusRing}`}>
                  IT Solutions
                </Link>
              </nav>

              <div className="flex shrink-0 items-center gap-3">
                <div ref={leadersRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setLeadersOpen((v) => !v)}
                    aria-expanded={leadersOpen}
                    aria-controls="leaders-menu"
                    aria-haspopup="true"
                    className={`flex items-center gap-3 rounded-full border border-[#E3B964]/70 bg-white/10 py-1.5 pl-4 pr-1.5 text-sm font-semibold text-white transition hover:bg-white/20 motion-reduce:transition-none ${focusRing}`}
                  >
                    Family Leadership
                    <ChevronBadge open={leadersOpen} />
                  </button>
                  {leadersOpen && (
                    <div
                      id="leaders-menu"
                      className="absolute right-0 top-full z-50 mt-3 w-[min(24rem,92vw)] rounded-3xl border-2 border-[#E3B964] bg-linear-to-b from-[#FFF4F6] to-[#FDE6EC] p-3 text-[#2E0A1C] shadow-2xl shadow-[#4A0F2E]/40"
                    >
                      <span className="absolute -top-2 right-8 h-4 w-4 rotate-45 border-l-2 border-t-2 border-[#E3B964] bg-[#6E0F3D]" aria-hidden="true" />
                      <div className="max-h-[70svh] overflow-y-auto">
                        <LeadershipPanel />
                      </div>
                    </div>
                  )}
                </div>
                <Link
                  href="/track-order"
                  className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold ${goldBtn} ${focusRing}`}
                >
                  <span aria-hidden="true">📍</span> Track Order
                </Link>
              </div>
            </div>
          </div>

          {/* Mobile menu */}
          {menuOpen && (
            <nav
              id="mobile-menu"
              aria-label="Mobile"
              className="max-h-[calc(100svh-8rem)] overflow-y-auto border-t border-[#F3C6D3] bg-[#FFF4F6] px-4 pb-4 md:hidden"
            >
              <ul className="flex flex-col">
                <li className="border-b border-[#F3C6D3] py-3">
                  <button
                    type="button"
                    onClick={() => setMobileLeadersOpen((v) => !v)}
                    aria-expanded={mobileLeadersOpen}
                    aria-controls="leaders-mobile"
                    className={`flex w-full items-center justify-between gap-3 rounded-2xl border border-[#E3B964] bg-white py-2 pl-4 pr-2 text-left font-semibold text-[#4A0F2E] ${focusRing}`}
                  >
                    Family Leadership
                    <ChevronBadge open={mobileLeadersOpen} />
                  </button>
                  {mobileLeadersOpen && (
                    <div id="leaders-mobile" className="mt-3 rounded-3xl border-2 border-[#E3B964] bg-linear-to-b from-[#FFF4F6] to-[#FDE6EC] p-3">
                      <LeadershipPanel />
                    </div>
                  )}
                </li>
                {NAV_LINKS.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith('/') ? (
                      <Link href={link.href} onClick={() => setMenuOpen(false)} className={`block rounded py-3 text-[#4A0F2E] hover:text-[#B0124F] ${focusRing}`}>
                        {link.label}
                      </Link>
                    ) : (
                      <a href={link.href} onClick={() => setMenuOpen(false)} className={`block rounded py-3 text-[#4A0F2E] hover:text-[#B0124F] ${focusRing}`}>
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
                <li>
                  <Link href="/track-order" onClick={() => setMenuOpen(false)} className={`block rounded py-3 text-[#4A0F2E] hover:text-[#B0124F] ${focusRing}`}>
                    📍 Track Order
                  </Link>
                </li>
                <li>
                  <Link href="/" onClick={() => setMenuOpen(false)} className={`block rounded py-3 text-[#4A0F2E] hover:text-[#B0124F] ${focusRing}`}>
                    💻 IT Solutions
                  </Link>
                </li>
                <li className="border-t border-[#F3C6D3] pt-3">
                  <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[#7A5566]">All Categories</p>
                  <ul className="grid grid-cols-2 gap-2">
                    {CATEGORIES.map((c) => (
                      <li key={c.slug}>
                        <button type="button" onClick={() => selectCategory(c.slug)} className={`w-full rounded-xl bg-white px-3 py-2 text-left text-sm ${focusRing}`}>
                          {c.icon} {c.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </li>
                <li className="mt-3 flex items-center justify-between gap-2 border-t border-[#F3C6D3] pt-3">
                  <button
                    type="button"
                    onClick={() => { setShowWishlistOnly((v) => !v); setMenuOpen(false); scrollToProducts(); }}
                    className={`rounded-full border border-[#F3C6D3] bg-white px-3 py-1.5 text-sm ${focusRing}`}
                  >
                    ♡ Wishlist ({wishlist.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => { setCompareOpen(true); setMenuOpen(false); scrollToProducts(); }}
                    className={`rounded-full border border-[#F3C6D3] bg-white px-3 py-1.5 text-sm ${focusRing}`}
                  >
                    ⇄ Compare ({compare.length})
                  </button>
                  <CurrencySelect id="currency-mobile" value={currency} onChange={handleCurrencyChange} />
                </li>
              </ul>
            </nav>
          )}
        </header>

        {/* ===== Hero (full-bleed) ===== */}
        <section
          id="deals"
          aria-labelledby="hero-title"
          className="relative w-full overflow-hidden bg-linear-to-br from-[#FFE3EC] via-[#FDEFF2] to-[#FBD3DE] pb-8 pt-10 sm:pt-12 lg:pb-0 lg:pt-14"
        >
          {/* gold ribbons + burgundy corners */}
          <div className="pointer-events-none absolute -left-16 top-1/3 h-3 w-80 -rotate-38deg rounded-full bg-linear-to-r from-[#C9A24B] to-[#F3D98B]" />
          <div className="pointer-events-none absolute -left-20 top-[45%] h-5 w-96 -rotate-[38deg rounded-full bg-linear-to-r from-[#B8892E] to-[#E3B964]" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-52 w-52 rounded-full bg-[#7A0F3C]" />
          <div className="pointer-events-none absolute -bottom-20 -right-20 h-52 w-52 rounded-full bg-[#7A0F3C]" />
          <div className="pointer-events-none absolute -right-16 bottom-16 h-3 w-80 -rotate-[38deg rounded-full bg-linear-to-r from-[#F3D98B] to-[#C9A24B]" />

          <div className="relative w-full px-4 sm:px-8 lg:px-12 2xl:px-24">
            <div className="grid items-center gap-8 lg:grid-cols-[1fr_1.15fr]">
              {/* Left: text + search */}
              <div className="text-center lg:mb-10 lg:text-left">
                <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-linear-to-r from-[#E3B964] to-[#F3D98B] px-4 py-1.5 text-xs font-bold text-[#2E0A1C] shadow sm:text-sm">
                  <span aria-hidden="true">👑</span> Premium Quality Products
                </p>
                <h1 id="hero-title" className="font-serif text-4xl font-extrabold leading-tight text-[#4A0F2E] sm:text-5xl 2xl:text-6xl">
                  Timeless Quality
                </h1>
                <p className="mb-4 font-serif text-3xl italic text-[#D81B7A] sm:text-4xl 2xl:text-5xl">Always With You</p>
                <p className="mx-auto mb-6 max-w-md text-sm text-[#4A0F2E] sm:text-base lg:mx-0">
                  Discover the best fashion, lifestyle and more with unbeatable prices and trusted quality.
                </p>
                <SearchForm
                  id="search-hero"
                  value={query}
                  onChange={setQuery}
                  onSubmit={scrollToProducts}
                  buttonLabel="Search"
                  className="mx-auto max-w-md lg:mx-0"
                />
              </div>

              {/* Center: family photo */}
              <div className="mx-auto w-full max-w-2xl lg:self-end">
                <img
                  src={HERO_IMAGE}
                  alt="Smart Family Point family leadership"
                  width={440}
                  height={293}
                  decoding="async"
                  className="block w-full object-cover"
                  style={{
                    WebkitMaskImage:
                      'linear-gradient(to right, transparent 0%, #000 14%, #000 86%, transparent 100%), linear-gradient(to bottom, transparent 0%, #000 14%)',
                    maskImage:
                      'linear-gradient(to right, transparent 0%, #000 14%, #000 86%, transparent 100%), linear-gradient(to bottom, transparent 0%, #000 14%)',
                    WebkitMaskComposite: 'source-in',
                    maskComposite: 'intersect',
                  }}
                />
              </div>

            </div>
          </div>
        </section>

        {/* ===== Feature strip ===== */}
        <section aria-label="Our promises" className={`${container} mt-4`}>
          <ul className="grid grid-cols-1 gap-4 rounded-2xl bg-[#FBD3DE]/70 p-4 min-[480px]:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-[#B0124F]/30">
            {FEATURES.map((f) => (
              <li key={f.title} className="flex items-center gap-3 lg:justify-center">
                <span className="text-2xl" aria-hidden="true">{f.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-[#2E0A1C]">{f.title}</p>
                  <p className="text-xs text-[#7A5566]">{f.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* ===== Shop by category ===== */}
        <section id="categories" aria-labelledby="cat-title" className={`${container} mt-8`}>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 id="cat-title" className="flex items-center gap-3 font-serif text-2xl font-bold text-[#4A0F2E] sm:text-3xl">
              Shop by Category <span className="hidden h-px w-24 bg-[#C9A24B] sm:block" />
            </h2>
            <button
              type="button"
              onClick={() => selectCategory('')}
              className={`rounded-full px-4 py-2 text-xs font-semibold sm:text-sm ${gradientBtn} ${focusRing}`}
            >
              View All Categories →
            </button>
          </div>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
            {CATEGORIES.map((c) => (
              <li key={c.slug}>
                <button
                  type="button"
                  onClick={() => selectCategory(c.slug)}
                  aria-pressed={activeCategory === c.slug}
                  className={`flex w-full flex-col items-center gap-2 rounded-2xl border bg-linear-to-b from-white to-[#FDE6EC] p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg motion-reduce:transition-none ${activeCategory === c.slug ? 'border-[#B0124F] ring-2 ring-[#B0124F]/40' : 'border-[#E3B964]'
                    } ${focusRing}`}
                >
                  <span className="text-5xl" aria-hidden="true">{c.icon}</span>
                  <span className="font-serif text-base font-semibold text-[#2E0A1C]">{c.name}</span>
                  <span className="rounded-full bg-linear-to-r from-[#B0124F] to-[#D81B7A] px-3 py-0.5 text-[11px] font-semibold text-white">
                    Up to {c.off}% OFF
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>

        {/* ===== Products ===== */}
        <main id="main" tabIndex={-1} className={`${container} flex-1 py-10 focus:outline-none sm:py-14`}>
          {/* Compare panel */}
          {compareOpen && (
            <section aria-label="Compare products" className="mb-8 rounded-2xl border border-[#E3B964] bg-white p-4 shadow">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-serif text-xl font-bold text-[#4A0F2E]">Compare ({compare.length}/4)</h2>
                <button type="button" onClick={() => setCompareOpen(false)} className={`rounded-full px-3 py-1 text-sm text-[#B0124F] hover:bg-[#FDE6EC] ${focusRing}`}>
                  Close
                </button>
              </div>
              {comparedProducts.length === 0 ? (
                <p className="text-sm text-[#7A5566]">Tap the ⇄ icon on a product to add it here.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-420px text-left text-sm">
                    <thead>
                      <tr className="border-b border-[#F3C6D3] text-[#7A5566]">
                        <th className="py-2 pr-4 font-medium">Product</th>
                        <th className="py-2 pr-4 font-medium">Price</th>
                        <th className="py-2"><span className="sr-only">Remove</span></th>
                      </tr>
                    </thead>
                    <tbody>
                      {comparedProducts.map((p) => (
                        <tr key={p.id} className="border-b border-[#FDE6EC]">
                          <td className="py-2 pr-4 font-semibold">{p.name}</td>
                          <td className="py-2 pr-4 font-bold text-[#B0124F]">{formatPrice(p.price, currency)}</td>
                          <td className="py-2 text-right">
                            <button type="button" onClick={() => handleCompare(p.id)} className={`rounded-full px-3 py-1 text-xs text-[#B0124F] hover:bg-[#FDE6EC] ${focusRing}`}>
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          )}

          <section id="products" aria-labelledby="products-title" className="scroll-mt-40">
            <div className="mb-8 text-center">
              <p className="mb-1 flex items-center justify-center gap-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#4A0F2E] sm:text-xs">
                <span className="h-px w-8 bg-[#C9A24B] sm:w-10" />
                Best Sellers
                <span className="h-px w-8 bg-[#C9A24B] sm:w-10" />
              </p>
              <h2 id="products-title" className="font-serif text-2xl font-bold sm:text-3xl lg:text-4xl">
                {activeCategoryName ? <>{activeCategoryName} </> : <>Featured </>}
                <span className="italic text-[#B0124F]">Products</span>
              </h2>
              {hasFilter && (
                <p className="mt-2 text-sm text-[#7A5566]">
                  {visibleProducts.length} result{visibleProducts.length === 1 ? '' : 's'}
                  {query.trim() && <> for “{query.trim()}”</>}
                  {showWishlistOnly && <> in your wishlist</>}{' '}
                  <button type="button" onClick={clearFilters} className={`font-semibold text-[#B0124F] underline ${focusRing}`}>
                    Clear filters
                  </button>
                </p>
              )}
            </div>

            {loading ? (
              <p className="text-center text-[#7A5566]">Loading products...</p>
            ) : visibleProducts.length === 0 ? (
              <p className="text-center text-[#7A5566]">
                {hasFilter
                  ? 'No products match your filters yet.'
                  : 'No products available right now. Please check back soon.'}
              </p>
            ) : (
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 lg:gap-6 2xl:grid-cols-5 min-[1920px]:grid-cols-6">
                {visibleProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    currency={currency}
                    wished={wishlist.includes(product.id)}
                    compared={compare.includes(product.id)}
                    onAdd={handleAdd}
                    onWish={handleWish}
                    onCompare={handleCompare}
                  />
                ))}
              </ul>
            )}
          </section>
        </main>

        <div role="status" aria-live="polite" className="sr-only">
          {announcement}
        </div>

        {/* ===== Our promise + Pay with ===== */}
        <section aria-label="Our promise and payment methods" className="mt-4 overflow-hidden bg-[#FBD3DE]/60">
          <div className="flex flex-col lg:flex-row">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 bg-linear-to-r from-[#4A0F2E] to-[#6E0F3D] px-4 py-4 text-white sm:px-6 lg:w-[52%] lg:rounded-br-[3rem] lg:px-10">
              <p className="font-serif text-lg font-bold">
                Our <span className="text-[#E3B964]">Promise:</span>
              </p>
              <ul className="flex flex-wrap gap-x-5 gap-y-1 text-sm">
                {PROMISES.map((p) => (
                  <li key={p} className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#E3B964] text-xs font-bold text-[#2E0A1C]" aria-hidden="true">✓</span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-1 flex-wrap items-center justify-center gap-x-4 gap-y-3 px-4 py-4 text-sm lg:justify-end lg:px-10">
              <span className="font-semibold text-[#4A0F2E]">Pay With:</span>
              <CurrencySelect id="currency-pay" value={currency} onChange={handleCurrencyChange} />
              <span className="rounded-md bg-white px-2 py-1 text-xs font-extrabold text-[#E2136E] shadow-sm">bKash</span>
              <span className="rounded-md bg-white px-2 py-1 text-xs font-extrabold text-[#F6921E] shadow-sm">Nagad</span>
              <span className="rounded-md bg-white px-2 py-1 text-sm font-extrabold italic text-[#1A1F71] shadow-sm">VISA</span>
              <span className="flex items-center rounded-md bg-white px-2 py-1 shadow-sm" aria-label="Mastercard">
                <span className="h-4 w-4 rounded-full bg-[#EB001B]" />
                <span className="-ml-1.5 h-4 w-4 rounded-full bg-[#F79E1B]/90" />
              </span>
              <span className="flex items-center gap-1.5 rounded-md bg-white px-2 py-1 text-[11px] font-semibold leading-tight text-[#2E0A1C] shadow-sm">
                <span className="text-lg text-emerald-600" aria-hidden="true">🛡️</span>
                SSL<br />Secure Payment
              </span>
            </div>
          </div>
        </section>
        {/* FLOATING CHAT WIDGET */}
        <FloatingChat />

        {/* ===== Footer ===== */}
        <footer id="footer-section" className="border-t-2 border-[#C9A24B] bg-linear-to-b from-[#4A0F2E] to-[#2E0A1C] py-12 text-[#FBD3DE]">
          <div className={container}>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:grid-cols-4 pb-8 border-b border-white/10 text-left">
              {/* Brand Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <img
                    src={LOGO_IMAGE}
                    alt={`${BRAND} logo`}
                    width={48}
                    height={48}
                    loading="lazy"
                    decoding="async"
                    className="h-12 w-12 rounded-full shadow-lg ring-2 ring-[#E3B964]/70"
                  />
                  <div>
                    <p className="font-serif text-lg font-bold italic text-white">{BRAND}</p>
                    <p className="text-[11px] italic text-[#E3B964]">{TAGLINE}</p>
                  </div>
                </div>
                <p className="text-xs text-[#FBD3DE]/80">
                  বিশ্বস্ততার সাথে প্রিমিয়াম কোয়ালিটি পণ্য এবং সেবা প্রদানে আমরা প্রতিশ্রুতিবদ্ধ।
                </p>
              </div>

              {/* Quick Links */}
              <div>
                <p className="mb-3 font-serif text-sm font-bold text-white uppercase tracking-wider">দ্রুত লিংক</p>
                <ul className="space-y-2 text-xs">
                  <li><Link href="/marketplace" className="hover:text-white transition">হোম</Link></li>
                  <li><Link href="/marketplace/about" className="hover:text-white transition">আমাদের সম্পর্কে (About Us)</Link></li>
                  <li><Link href="/marketplace/contact" className="hover:text-white transition">যোগাযোগ ও মিটিং বুকিং</Link></li>
                  <li><Link href="/blog" className="hover:text-white transition">ব্লগ</Link></li>
                  <li><Link href="/track-order" className="hover:text-white transition">অর্ডার ট্র্যাক করুন</Link></li>
                </ul>
              </div>

              {/* Policies */}
              <div>
                <p className="mb-3 font-serif text-sm font-bold text-white uppercase tracking-wider">নীতিমালা</p>
                <ul className="space-y-2 text-xs">
                  <li><Link href="/privacy" className="hover:text-white transition">প্রাইভেসি পলিসি</Link></li>
                  <li><Link href="/terms" className="hover:text-white transition">শর্তাবলী (Terms)</Link></li>
                  <li><Link href="/refund-policy" className="hover:text-white transition">রিফান্ড পলিসি</Link></li>
                  <li><Link href="/cancellation" className="hover:text-white transition">বাতিলকরণ নীতি</Link></li>
                </ul>
              </div>

              {/* Contact & Support */}
              <div>
                <p className="mb-3 font-serif text-sm font-bold text-white uppercase tracking-wider">সরাসরি যোগাযোগ</p>
                <p className="text-xs text-[#FBD3DE]/80 mb-2">যেকোনো সহায়তার জন্য আমাদের কন্টাক্ট পেজ ভিজিট করুন অথবা মিটিং বুক করুন।</p>
                <Link
                  href="/marketplace/contact"
                  className="inline-block rounded-full bg-linear-to-r from-[#E3B964] to-[#C9A24B] px-4 py-2 text-xs font-bold text-[#2E0A1C] shadow transition hover:brightness-105"
                >
                  যোগাযোগ করুন / মিটিং বুক করুন
                </Link>
              </div>
            </div>

            <div className="pt-6 text-center text-xs">
              <p>&copy; {year} {BRAND}. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}