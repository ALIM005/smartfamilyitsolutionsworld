'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const mobileLinks = [
  { href: '/', label: '🏠 Home' },

  { href: '/products', label: '🛒 Products' },
  { href: '/features', label: '✨ Features' },
  { href: '/marketplace', label: '🏪 Marketplace' },

  { href: '/services/web-development', label: '🌐 Web & E-Commerce Dev' },
  { href: '/services/erp-software', label: '📦 ERP & Business Software' },
  { href: '/services/digital-marketing', label: '📈 Digital Marketing & SEO' },
  { href: '/services/design-branding', label: '🎨 Design, Branding & IT' },

  { href: '/about', label: '🏢 About Us' },
  { href: '/portfolio', label: '💼 Portfolio' },
  { href: '/team', label: '👥 Our Team' },
  { href: '/packages', label: '🏷️ Packages / Price' },

  { href: '/contact', label: '📞 Contact' },
  { href: '/wishlist', label: '❤️ Wishlist' },
  { href: '/compare', label: '⚖️ Compare' },
];

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Route change hole menu close hobe
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Outside click / Escape key hole menu close hobe
  useEffect(() => {
    if (!open) return;

    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscapeKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [open]);

  return (
    <div className="relative lg:hidden" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="mobile-navigation-menu"
        aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-[#3a2600] bg-[linear-gradient(180deg,#fff0a8_0%,#ffd34d_30%,#e8a817_65%,#b97a05_100%)] text-[#0a1f5c] shadow-[0_0_12px_rgba(255,200,60,0.7),inset_0_2px_3px_rgba(255,255,255,0.7)] transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a1f5c]"
      >
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="h-6 w-6 fill-none stroke-current"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {open ? (
            <path d="M6 6l12 12M18 6L6 18" />
          ) : (
            <path d="M4 7h16M4 12h16M4 17h16" />
          )}
        </svg>
      </button>

      {open && (
        <div
          id="mobile-navigation-menu"
          className="absolute right-0 top-full z-[60] mt-2 w-[min(92vw,340px)] overflow-hidden rounded-2xl border-2 border-[#e0a820] bg-white shadow-2xl"
        >
          <div className="max-h-[70vh] overflow-y-auto p-2">
            <ul className="grid grid-cols-1 gap-1">
              {mobileLinks.map((link) => {
                const isActive = pathname === link.href;

                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      aria-current={isActive ? 'page' : undefined}
                      className={`block rounded-xl px-3 py-2.5 text-sm font-bold transition ${
                        isActive
                          ? 'bg-[#fff1c2] text-[#0a1f5c]'
                          : 'text-[#0a1f5c] hover:bg-[#fff1c2]'
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}