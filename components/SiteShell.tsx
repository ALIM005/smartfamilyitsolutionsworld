'use client';

import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

/*
  Smart Family Point – shared page shell (header + footer)
  Blush: #FFF4F6 / #FDE6EC / #FBD3DE   Magenta: #B0124F → #D81B7A
  Plum : #4A0F2E / #2E0A1C             Gold   : #C9A24B / #E3B964
  Files: public/images/logo.png
*/

const BRAND = 'Smart Family Point';
const TAGLINE = 'Together for a Better Life';
const LOGO_IMAGE = '/images/logo.png';
const HOME_PATH = '/marketplace';

interface NavItem {
  label: string;
  href: string;
}

// 📌 এখানে Contact লিংকটি ঠিক করা হয়েছে সরাসরি /contact পেজে পয়েন্ট করার জন্য
const NAV_ITEMS: readonly NavItem[] = [
  { label: 'Home', href: HOME_PATH },
  { label: 'Shop', href: `${HOME_PATH}#products` },
  { label: 'About Us', href: '/about' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];

const focusRing =
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B0124F] focus-visible:ring-offset-2';
const gradientBtn =
  'bg-linear-to-r from-[#B0124F] to-[#D81B7A] text-white shadow-md shadow-[#B0124F]/30 transition hover:from-[#990F44] hover:to-[#C21769] motion-reduce:transition-none';
const goldBtn =
  'bg-linear-to-r from-[#E3B964] to-[#C9A24B] text-[#2E0A1C] shadow-md shadow-black/10 transition hover:brightness-105 motion-reduce:transition-none';
const container = 'mx-auto w-full max-w-[1920px] px-4 sm:px-6 lg:px-10 2xl:px-16';

export default function SiteShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const year = new Date().getFullYear();

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  const isActive = (href: string): boolean => !href.includes('#') && pathname === href;

  return (
    <div className="fixed inset-0 z-60 overflow-y-auto overflow-x-hidden overscroll-contain bg-linear-to-b from-[#FFF4F6] via-[#FFF9FA] to-[#FDE6EC] text-[#2E0A1C]">
      <div className="flex min-h-full w-full flex-col">
        {/* ===== Header ===== */}
        <header className="sticky top-0 z-40 shadow-md shadow-[#B0124F]/10">
          <div className="border-b border-[#F3C6D3] bg-linear-to-r from-[#FFF4F6] via-[#FDE6EC] to-[#FFF4F6]">
            <div className={`${container} flex items-center justify-between gap-3 py-2 sm:py-3`}>
              <Link
                href={HOME_PATH}
                aria-label={`${BRAND} home`}
                className={`flex shrink-0 items-center gap-2 rounded ${focusRing}`}
              >
                <img
                  src={LOGO_IMAGE}
                  alt=""
                  width={64}
                  height={64}
                  decoding="async"
                  className="h-11 w-11 rounded-full shadow-md shadow-[#4A0F2E]/30 sm:h-16 sm:w-16"
                />
                <span className="flex flex-col leading-none">
                  <span className="font-serif text-xl font-extrabold tracking-wide text-[#4A0F2E] sm:text-3xl">SMART</span>
                  <span className="font-serif text-sm font-extrabold tracking-wide text-[#B0124F] sm:text-2xl">FAMILY POINT</span>
                  <span className="mt-0.5 hidden text-[10px] italic text-[#4A0F2E] sm:block">— {TAGLINE} —</span>
                </span>
              </Link>

              <div className="flex items-center gap-2 sm:gap-3">
                <Link
                  href="/cart"
                  className={`rounded-full px-4 py-2 text-sm font-semibold ${gradientBtn} ${focusRing}`}
                >
                  Cart
                </Link>
                <button
                  type="button"
                  className={`rounded p-2 text-[#4A0F2E] md:hidden ${focusRing}`}
                  aria-expanded={menuOpen}
                  aria-controls="shell-mobile-menu"
                  aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                  onClick={() => setMenuOpen((open) => !open)}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                    {menuOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Burgundy nav bar (desktop) */}
          <div className="hidden bg-linear-to-r from-[#4A0F2E] via-[#6E0F3D] to-[#4A0F2E] text-white md:block">
            <div className={`${container} flex items-center justify-between gap-6 py-2`}>
              <nav aria-label="Primary" className="flex flex-1 items-center gap-6 text-sm font-semibold lg:gap-10">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    aria-current={isActive(item.href) ? 'page' : undefined}
                    className={`rounded border-b-2 pb-1 hover:text-[#E3B964] ${
                      isActive(item.href) ? 'border-white text-[#E3B964]' : 'border-transparent'
                    } ${focusRing}`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <Link
                href="/track-order"
                className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold ${goldBtn} ${focusRing}`}
              >
                <span aria-hidden="true">📍</span> Track Order
              </Link>
            </div>
          </div>

          {/* Mobile menu */}
          {menuOpen && (
            <nav
              id="shell-mobile-menu"
              aria-label="Mobile"
              className="max-h-[calc(100svh-5rem)] overflow-y-auto border-t border-[#F3C6D3] bg-[#FFF4F6] px-4 pb-4 md:hidden"
            >
              <ul className="flex flex-col">
                {[...NAV_ITEMS, { label: '📍 Track Order', href: '/track-order' }].map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      aria-current={isActive(item.href) ? 'page' : undefined}
                      className={`block rounded py-3 hover:text-[#B0124F] ${
                        isActive(item.href) ? 'font-bold text-[#B0124F]' : 'text-[#4A0F2E]'
                      } ${focusRing}`}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </header>

        {/* ===== Page content ===== */}
        <div className="flex-1">{children}</div>

        {/* ===== Footer (Updated with Quick Links & Contact Info) ===== */}
        <footer className="mt-12 border-t-2 border-[#C9A24B] bg-linear-to-b from-[#4A0F2E] to-[#2E0A1C] py-10 text-[#FBD3DE]">
          <div className={`${container} grid grid-cols-1 gap-8 text-left md:grid-cols-3`}>
            {/* Column 1: Brand Info */}
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={LOGO_IMAGE}
                  alt={`${BRAND} logo`}
                  width={50}
                  height={50}
                  loading="lazy"
                  decoding="async"
                  className="h-12 w-12 rounded-full shadow-lg shadow-black/40 ring-2 ring-[#E3B964]/70"
                />
                <span className="font-serif text-xl font-bold text-white">{BRAND}</span>
              </div>
              <p className="text-xs italic text-[#E3B964] mb-3">{TAGLINE}</p>
              <p className="text-xs text-[#FBD3DE]/80 leading-relaxed">
                ওয়েব ও সফটওয়্যার সলিউশন, ERP, ই-কমার্স এবং স্মার্ট বিজনেস অ্যাপ্লিকেশন প্রদানকারী ডাইনামিক প্ল্যাটফর্ম।
              </p>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-[#E3B964]">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/" className="hover:text-white">Home</Link></li>
                <li><Link href="/products" className="hover:text-white">Products</Link></li>
                <li><Link href="/marketplace" className="hover:text-white">Marketplace</Link></li>
                <li><Link href="/about" className="hover:text-white">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
                <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
              </ul>
            </div>

            {/* Column 3: Contact Info */}
            <div>
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-[#E3B964]">Contact Us</h3>
              <div className="space-y-2 text-sm text-[#FBD3DE]">
                <p className="font-semibold text-white">H M ALIM UDDIN</p>
                <p>📍 Burdeo, Companyganj-3140, Sylhet</p>
                <p>✉️ <a href="mailto:alim@smartfamilyitsolutionsworld.com" className="hover:underline">alim@smartfamilyitsolutionsworld.com</a></p>
                <div className="pt-2">
                  <a 
                    href="https://wa.me/" 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg bg-[#25D366] px-3 py-1.5 text-xs font-bold text-white hover:opacity-90"
                  >
                    💬 Chat on WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-[#6E0F3D] pt-4 text-center text-xs text-[#FBD3DE]/60">
            &copy; {year} {BRAND}. All rights reserved.
          </div>
        </footer>
      </div>
    </div>
  );
}